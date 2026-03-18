import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 구인/구직 목록 조회 (공개)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const type = searchParams.get("type"); // 구인, 구직
  const offset = (page - 1) * limit;

  let query = supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) {
    query = query.eq("type", type);
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

// 구인/구직 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  const { error: authError, user, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { title, content, type, deadline, status } = body;

  if (!title) {
    return NextResponse.json({ error: "제목은 필수입니다." }, { status: 400 });
  }

  const { data, error } = await supabase!
    .from("jobs")
    .insert({
      title,
      content: content || "",
      type: type || "구인",
      deadline: deadline || null,
      status: status || "진행중",
      created_by: user!.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
