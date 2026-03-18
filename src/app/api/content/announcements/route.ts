import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 공지사항 목록 조회 (공개)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const category = searchParams.get("category"); // 연맹공지, 행사공지
  const search = searchParams.get("search");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("announcements")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== "전체") {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error, count } = await query;

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

// 공지사항 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  const { error: authError, user, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { title, content, category } = body;

  if (!title) {
    return NextResponse.json({ error: "제목은 필수입니다." }, { status: 400 });
  }

  const { data, error } = await supabase!
    .from("announcements")
    .insert({
      title,
      content: content || "",
      category: category || "연맹공지",
      created_by: user!.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
