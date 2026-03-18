import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 관리자 - 회원 역할 변경
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const { role } = body;

    if (!role || !["user", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "유효하지 않은 역할입니다." },
        { status: 400 }
      );
    }

    const { data, error: updateError } = await supabase!
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("역할 변경 실패:", updateError);
      return NextResponse.json(
        { error: "역할 변경에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: data });
  } catch (err) {
    console.error("역할 변경 처리 실패:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
