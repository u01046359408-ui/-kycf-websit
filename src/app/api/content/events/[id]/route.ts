import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 행사일정 수정 (관리자 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { title, date, location, category, status, description, is_published } = body;

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (date !== undefined) updateData.date = date;
  if (location !== undefined) updateData.location = location;
  if (category !== undefined) updateData.category = category;
  if (status !== undefined) updateData.status = status;
  if (description !== undefined) updateData.description = description;
  if (is_published !== undefined) updateData.is_published = is_published;

  const { data, error } = await supabase!
    .from("events")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 행사일정 삭제 (관리자 전용)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const { error } = await supabase!
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
