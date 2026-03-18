// 관리자 회원 목록 조회 API (기록 등록 시 회원 선택용)
// GET /api/admin/members?search=xxx - 회원 검색 (이름/이메일)

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const limit = parseInt(searchParams.get("limit") ?? "50");

  try {
    let query = supabase!
      .from("profiles")
      .select("id, email, name, phone, role")
      .order("name", { ascending: true })
      .limit(limit);

    // 이름 또는 이메일로 검색
    if (search) {
      const sanitized = search.replace(/[%_\\,()]/g, "");
      if (sanitized) {
        query = query.or(
          `name.ilike.%${sanitized}%,email.ilike.%${sanitized}%`
        );
      }
    }

    const { data: members, error: queryError } = await query;

    if (queryError) {
      console.error("회원 목록 조회 실패:", queryError);
      return NextResponse.json(
        { error: "조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ members: members ?? [] });
  } catch (err) {
    console.error("회원 목록 조회 오류:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
