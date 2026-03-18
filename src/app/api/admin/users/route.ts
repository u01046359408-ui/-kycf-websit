import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 관리자 회원 목록 조회
export async function GET(request: NextRequest) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";

  const offset = (page - 1) * limit;

  try {
    let query = supabase!
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // 이름 또는 이메일로 검색 (입력값 sanitize)
    if (search) {
      const sanitized = search.replace(/[%_\\,()]/g, "");
      if (sanitized) {
        query = query.or(`name.ilike.%${sanitized}%,email.ilike.%${sanitized}%`);
      }
    }

    const { data: users, count } = await query;

    return NextResponse.json({
      users: users ?? [],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    });
  } catch (err) {
    console.error("회원 목록 조회 실패:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
