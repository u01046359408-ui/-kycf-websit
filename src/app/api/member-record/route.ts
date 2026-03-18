// 회원 본인 기록 조회 API
// GET /api/member-record?type=transcript - 인증된 사용자의 본인 기록 조회
// user_id 기반으로 조회 (profiles 테이블의 id와 매칭)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // 필수 파라미터 검증
    if (!type) {
      return NextResponse.json(
        { error: "기록 유형(type)은 필수입니다." },
        { status: 400 }
      );
    }

    // user_id 기반으로 기록 조회
    const { data: record, error: queryError } = await supabase
      .from("member_records")
      .select("*")
      .eq("user_id", user.id)
      .eq("record_type", type)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (queryError) {
      console.error("회원 기록 조회 실패:", queryError);
      return NextResponse.json(
        { error: "기록 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    // 기록이 없을 수 있음 (아직 관리자가 입력하지 않은 경우)
    return NextResponse.json({ record: record ?? null });
  } catch (err) {
    console.error("회원 기록 조회 오류:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
