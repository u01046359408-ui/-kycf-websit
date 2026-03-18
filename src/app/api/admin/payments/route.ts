import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 관리자 결제 목록 조회
export async function GET(request: NextRequest) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const status = searchParams.get("status") ?? "all";

  const offset = (page - 1) * limit;

  try {
    let query = supabase!
      .from("payments")
      .select(
        "*, profile:profiles!payments_user_id_fkey(name, email), template:certificate_templates!payments_certificate_template_id_fkey(name)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // 상태 필터
    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data: payments, count } = await query;

    return NextResponse.json({
      payments: payments ?? [],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    });
  } catch (err) {
    console.error("결제 목록 조회 실패:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
