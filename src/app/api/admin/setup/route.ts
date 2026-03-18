// 최초 관리자 설정 API
// POST /api/admin/setup
// 관리자가 한 명도 없을 때만 동작 (최초 1회)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다. 먼저 회원가입 후 로그인하세요." },
        { status: 401 }
      );
    }

    // 이미 관리자가 있는지 확인
    const { data: existingAdmin } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (existingAdmin) {
      return NextResponse.json(
        { error: "이미 관리자가 등록되어 있습니다. 기존 관리자에게 권한을 요청하세요." },
        { status: 403 }
      );
    }

    // 현재 사용자를 관리자로 승격
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", user.id);

    if (updateError) {
      console.error("관리자 설정 실패:", updateError);
      return NextResponse.json(
        { error: "관리자 설정에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "관리자 권한이 부여되었습니다. /admin 페이지로 이동하세요.",
    });
  } catch (error) {
    console.error("관리자 설정 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
