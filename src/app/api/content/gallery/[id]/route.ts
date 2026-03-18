import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 갤러리 수정 (관리자 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { title, description, image_url, is_published } = body;

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (image_url !== undefined) updateData.image_url = image_url;
  if (is_published !== undefined) updateData.is_published = is_published;

  const { data, error } = await supabase!
    .from("gallery")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 갤러리 삭제 (관리자 전용)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error: authError, supabase } = await verifyAdmin();
  if (authError) return authError;

  const { error } = await supabase!
    .from("gallery")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
