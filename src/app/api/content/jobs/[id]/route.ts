import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 구인/구직 수정 (관리자 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { title, content, type, deadline, status, is_published } = body;

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (type !== undefined) updateData.type = type;
  if (deadline !== undefined) updateData.deadline = deadline;
  if (status !== undefined) updateData.status = status;
  if (is_published !== undefined) updateData.is_published = is_published;

  const { data, error } = await supabase!
    .from("jobs")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 구인/구직 삭제 (관리자 전용)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const { error } = await supabase!
    .from("jobs")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
