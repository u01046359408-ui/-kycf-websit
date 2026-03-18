import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 갤러리 목록 조회 (공개)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("gallery")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// 갤러리 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  const { error: authError, user, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { title, description, image_url } = body;

  if (!title) {
    return NextResponse.json({ error: "제목은 필수입니다." }, { status: 400 });
  }

  const { data, error } = await supabase!
    .from("gallery")
    .insert({
      title,
      description: description || "",
      image_url: image_url || null,
      created_by: user!.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
