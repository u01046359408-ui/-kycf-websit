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

    if (error || !data) {
      // DB에 없으면 빈 데이터 반환 (404 대신)
      return NextResponse.json({ page_key: key, title: "", content: "", metadata: {} });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ page_key: "", title: "", content: "", metadata: {} });
  }
}

// PUT: Admin only - upsert page content (없으면 생성, 있으면 수정)
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

    // upsert: 있으면 업데이트, 없으면 생성
    const { data, error } = await supabase!
      .from("page_contents")
      .upsert(
        {
          page_key: key,
          title: title || key,
          content: content || "",
          metadata: metadata || {},
          updated_by: user!.id,
        },
        { onConflict: "page_key" }
      )
      .select()
      .single();

    if (error) {
      console.error("Page content upsert error:", error);
      return NextResponse.json(
        { error: "저장에 실패했습니다: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
