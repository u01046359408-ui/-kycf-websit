// 결제 주문 생성 API
// POST /api/payment/request

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOrderId } from "@/lib/toss/client";

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
    const {
      certificateId,
      applicantName,
      applicantBirthDate,
      applicantPhone,
      purpose,
    } = body;

    // 필수 파라미터 검증
    if (
      !certificateId ||
      !applicantName ||
      !applicantBirthDate ||
      !applicantPhone ||
      !purpose
    ) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 증명서 템플릿 조회 (type 문자열로 조회 - 클라이언트에서 type을 전달)
    const { data: template, error: templateError } = await supabase
      .from("certificate_templates")
      .select("*")
      .eq("type", certificateId)
      .eq("is_active", true)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: "유효하지 않은 증명서입니다." },
        { status: 400 }
      );
    }

    // 주문번호 생성
    const orderId = generateOrderId();

    // DB에 pending 상태 payment 레코드 생성
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        order_id: orderId,
        toss_order_id: orderId,
        amount: template.price,
        status: "pending",
        certificate_template_id: template.id,
        // 신청자 정보를 metadata로 저장 (결제 승인 시 증명서 생성에 사용)
        metadata: {
          applicant_name: applicantName,
          applicant_birth_date: applicantBirthDate,
          applicant_phone: applicantPhone,
          purpose: purpose,
        },
      })
      .select()
      .single();

    if (paymentError) {
      console.error("결제 레코드 생성 실패:", paymentError);
      return NextResponse.json(
        { error: "결제 주문 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    // 토스페이먼츠에 전달할 정보 반환
    return NextResponse.json({
      orderId: orderId,
      amount: template.price,
      orderName: template.name,
      customerName: applicantName,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("결제 요청 처리 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
