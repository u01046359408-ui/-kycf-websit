// 결제 승인 API
// POST /api/payment/confirm

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  confirmPayment,
  generateSerialNumber,
  TossPaymentError,
} from "@/lib/toss/client";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "결제 승인에 필요한 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // DB에서 해당 주문 조회 (본인 주문인지 확인)
    const { data: payment, error: paymentQueryError } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("user_id", user.id)
      .single();

    if (paymentQueryError || !payment) {
      return NextResponse.json(
        { error: "해당 주문을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이미 처리된 결제인지 확인
    if (payment.status !== "pending") {
      return NextResponse.json(
        { error: "이미 처리된 결제입니다." },
        { status: 400 }
      );
    }

    // 금액 검증 (DB의 금액과 토스에서 전달된 금액 비교, 정수로 통일)
    if (payment.amount !== Math.round(Number(amount))) {
      // 금액 불일치 시 결제 실패 처리
      await supabase
        .from("payments")
        .update({
          status: "failed",
          failure_code: "AMOUNT_MISMATCH",
          failure_message: "결제 금액이 일치하지 않습니다.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      return NextResponse.json(
        { error: "결제 금액이 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인 API 호출
    const tossResponse = await confirmPayment({
      paymentKey,
      orderId,
      amount,
    });

    // 결제 승인 성공 -> DB 업데이트
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        payment_key: tossResponse.paymentKey,
        status: "completed",
        method: tossResponse.method,
        receipt_url: tossResponse.receipt?.url || null,
        approved_at: tossResponse.approvedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updateError) {
      console.error("결제 상태 업데이트 실패:", updateError);
      // 토스에서는 승인됐지만 DB 업데이트 실패 - 로그 기록 필요
    }

    // 증명서 레코드 생성
    const serialNumber = generateSerialNumber();
    const metadata = payment.metadata as {
      applicant_name: string;
      applicant_birth_date: string;
      applicant_phone: string;
      purpose: string;
      certificate_type?: string;
    };

    // 회원 성적/자격 기록 조회 (member_records에서 해당 회원 데이터 가져오기)
    let recordData: Record<string, unknown> = {};
    if (metadata.applicant_name && metadata.applicant_birth_date) {
      // 증명서 템플릿의 종류 조회
      const { data: template } = await supabase
        .from("certificate_templates")
        .select("type")
        .eq("id", payment.certificate_template_id)
        .single();

      if (template?.type) {
        const { data: memberRecord } = await supabase
          .from("member_records")
          .select("data")
          .eq("name", metadata.applicant_name)
          .eq("birth_date", metadata.applicant_birth_date)
          .eq("certificate_type", template.type)
          .maybeSingle();

        if (memberRecord?.data) {
          recordData = memberRecord.data as Record<string, unknown>;
        }
      }
    }

    const { data: certificate, error: certError } = await supabase
      .from("certificates")
      .insert({
        user_id: user.id,
        payment_id: payment.id,
        template_id: payment.certificate_template_id,
        serial_number: serialNumber,
        applicant_name: metadata.applicant_name,
        applicant_birth_date: metadata.applicant_birth_date,
        applicant_phone: metadata.applicant_phone,
        purpose: metadata.purpose,
        record_data: recordData,
        issued_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (certError) {
      console.error("증명서 생성 실패:", certError);
      // 결제는 완료됐지만 증명서 생성 실패 - 경고 플래그 포함하여 반환
      return NextResponse.json({
        success: true,
        warning: "결제는 완료되었으나 증명서 생성에 실패했습니다. 마이페이지에서 재발급을 시도하거나 고객센터에 문의해 주세요.",
        orderId: tossResponse.orderId,
        amount: tossResponse.totalAmount,
        method: tossResponse.method,
        approvedAt: tossResponse.approvedAt,
        receiptUrl: tossResponse.receipt?.url || null,
        certificate: null,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: tossResponse.orderId,
      amount: tossResponse.totalAmount,
      method: tossResponse.method,
      approvedAt: tossResponse.approvedAt,
      receiptUrl: tossResponse.receipt?.url || null,
      certificate: {
        id: certificate.id,
        serialNumber: certificate.serial_number,
      },
    });
  } catch (error) {
    console.error("결제 승인 처리 오류:", error);

    if (error instanceof TossPaymentError) {
      // 토스 결제 실패 시 DB 상태 업데이트
      try {
        const supabase = await createClient();
        const body = await request.clone().json();

        await supabase
          .from("payments")
          .update({
            status: "failed",
            failure_code: error.code,
            failure_message: error.message,
            updated_at: new Date().toISOString(),
          })
          .eq("order_id", body.orderId);
      } catch (dbError) {
        console.error("결제 실패 상태 업데이트 오류:", dbError);
      }

      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
