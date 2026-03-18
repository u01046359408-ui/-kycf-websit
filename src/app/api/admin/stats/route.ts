import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 관리자 대시보드 통계 조회
export async function GET() {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  try {
    // 총 회원수
    const { count: totalUsers } = await supabase!
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // 총 결제건수 및 매출액
    const { data: paymentStats } = await supabase!
      .from("payments")
      .select("amount, status");

    const completedPayments = paymentStats?.filter(
      (p) => p.status === "completed"
    );
    const totalPayments = paymentStats?.length ?? 0;
    const totalRevenue =
      completedPayments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;

    // 총 발급건수
    const { count: totalCertificates } = await supabase!
      .from("certificates")
      .select("*", { count: "exact", head: true });

    // 최근 결제 5건 (프로필, 템플릿 조인)
    const { data: recentPayments } = await supabase!
      .from("payments")
      .select(
        "*, profile:profiles!payments_user_id_fkey(*), template:certificate_templates!payments_certificate_template_id_fkey(*)"
      )
      .order("created_at", { ascending: false })
      .limit(5);

    // 최근 7일 통계
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();

    const { count: weeklyNewUsers } = await supabase!
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgoStr);

    const { data: weeklyPaymentData } = await supabase!
      .from("payments")
      .select("amount, status")
      .gte("created_at", sevenDaysAgoStr);

    const weeklyCompletedPayments = weeklyPaymentData?.filter(
      (p) => p.status === "completed"
    );
    const weeklyPayments = weeklyPaymentData?.length ?? 0;
    const weeklyRevenue =
      weeklyCompletedPayments?.reduce((sum, p) => sum + p.amount, 0) ?? 0;

    const { count: weeklyCertificates } = await supabase!
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgoStr);

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      totalPayments,
      totalRevenue,
      totalCertificates: totalCertificates ?? 0,
      recentPayments: recentPayments ?? [],
      weeklyStats: {
        newUsers: weeklyNewUsers ?? 0,
        payments: weeklyPayments,
        revenue: weeklyRevenue,
        certificates: weeklyCertificates ?? 0,
      },
    });
  } catch (err) {
    console.error("대시보드 통계 조회 실패:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
