import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// DELETE: 관리자 전용 - 모든 page_contents 데이터 초기화 (이전 형식 데이터 정리)
export async function DELETE() {
  try {
    const { error: authError, supabase } = await verifyAdmin();
    if (authError) return authError;

    const { error } = await supabase!
      .from("page_contents")
      .delete()
      .neq("page_key", ""); // 모든 행 삭제

    if (error) {
      return NextResponse.json(
        { error: "삭제 실패: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "모든 페이지 콘텐츠가 초기화되었습니다." });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
