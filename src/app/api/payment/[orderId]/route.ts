// 결제 상태 조회 API
// GET /api/payment/[orderId]

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const supabase = await createClient();
    const { orderId } = await params;

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

    // 본인 결제만 조회 가능
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select(
        `
        *,
        certificate_templates (
          id,
          name,
          type,
          price
        )
      `
      )
      .eq("order_id", orderId)
      .eq("user_id", user.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: "해당 주문을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 증명서 정보도 함께 조회
    let certificate = null;
    if (payment.status === "completed") {
      const { data: cert } = await supabase
        .from("certificates")
        .select("*")
        .eq("payment_id", payment.id)
        .single();

      certificate = cert;
    }

    return NextResponse.json({
      payment: {
        id: payment.id,
        orderId: payment.order_id,
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        receiptUrl: payment.receipt_url,
        approvedAt: payment.approved_at,
        createdAt: payment.created_at,
        template: payment.certificate_templates,
      },
      certificate: certificate
        ? {
            id: certificate.id,
            serialNumber: certificate.serial_number,
            pdfUrl: certificate.pdf_url,
            issuedAt: certificate.issued_at,
          }
        : null,
    });
  } catch (error) {
    console.error("결제 조회 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
