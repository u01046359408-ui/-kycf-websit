import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 공지사항 상세 조회 (공개) + 조회수 증가
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "공지사항을 찾을 수 없습니다." }, { status: 404 });
  }

  // 조회수 증가
  await supabase
    .from("announcements")
    .update({ views: data.views + 1 })
    .eq("id", id);

  return NextResponse.json(data);
}

// 공지사항 수정 (관리자 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { title, content, category, is_published } = body;

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (category !== undefined) updateData.category = category;
  if (is_published !== undefined) updateData.is_published = is_published;

  const { data, error } = await supabase!
    .from("announcements")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 공지사항 삭제 (관리자 전용)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const { error } = await supabase!
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
