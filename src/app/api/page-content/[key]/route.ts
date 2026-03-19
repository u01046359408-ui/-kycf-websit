import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin/auth";

// GET: Public - fetch page content by key
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("page_contents")
      .select("*")
      .eq("page_key", key)
      .single();

    if (error) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Admin only - update page content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { error: authError, user, supabase } = await verifyAdmin();
    if (authError) return authError;

    const { key } = await params;
    const body = await request.json();
    const { title, content, metadata } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (metadata !== undefined) updateData.metadata = metadata;
    updateData.updated_by = user!.id;

    const { data, error } = await supabase!
      .from("page_contents")
      .update(updateData)
      .eq("page_key", key)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update page content" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
