import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 행사일정 목록 조회 (공개)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status"); // 접수중, 마감, 예정
  const offset = (page - 1) * limit;

  let query = supabase
    .from("events")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
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

// 행사일정 생성 (관리자 전용)
export async function POST(request: NextRequest) {
  const { error: authError, user, supabase } = await verifyAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { title, date, location, category, status, description } = body;

  if (!title || !date) {
    return NextResponse.json({ error: "제목과 날짜는 필수입니다." }, { status: 400 });
  }

  const { data, error } = await supabase!
    .from("events")
    .insert({
      title,
      date,
      location: location || "",
      category: category || "행사",
      status: status || "예정",
      description: description || "",
      created_by: user!.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
