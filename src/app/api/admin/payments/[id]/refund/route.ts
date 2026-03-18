import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 관리자 - 결제 환불 처리
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    // 결제 정보 조회
    const { data: payment, error: fetchError } = await supabase!
      .from("payments")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !payment) {
      return NextResponse.json(
        { error: "결제 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (payment.status !== "completed") {
      return NextResponse.json(
        { error: "완료된 결제만 환불할 수 있습니다." },
        { status: 400 }
      );
    }

    // 토스페이먼츠 환불 API 호출
    if (payment.payment_key) {
      const tossSecretKey = process.env.TOSS_SECRET_KEY;
      if (!tossSecretKey) {
        return NextResponse.json(
          { error: "결제 설정 오류입니다." },
          { status: 500 }
        );
      }

      const response = await fetch(
        `https://api.tosspayments.com/v1/payments/${payment.payment_key}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(tossSecretKey + ":").toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cancelReason: "관리자 환불 처리" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("토스 환불 실패:", errorData);
        return NextResponse.json(
          { error: "환불 처리에 실패했습니다." },
          { status: 500 }
        );
      }
    }

    // DB 상태 업데이트
    const { data: updated, error: updateError } = await supabase!
      .from("payments")
      .update({
        status: "refunded",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("환불 상태 업데이트 실패:", updateError);
      return NextResponse.json(
        { error: "환불 상태 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ payment: updated });
  } catch (err) {
    console.error("환불 처리 실패:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
