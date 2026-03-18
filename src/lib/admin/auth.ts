import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 관리자 권한 검증 헬퍼
 * - 로그인 여부 확인
 * - profiles 테이블에서 role === 'admin' 확인
 * - 실패 시 에러 응답 반환, 성공 시 user와 supabase 클라이언트 반환
 */
export async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
      supabase: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
      supabase: null,
    };
  }

  return { error: null, user, supabase };
}
