// 레거시 호환 - 새 API는 /api/admin/member-records 를 사용하세요
// 이 파일은 기존 코드 호환을 위해 새 API로 프록시합니다.

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

const VALID_RECORD_TYPES = [
  "qualification",
  "career",
  "completion",
  "transcript",
  "employment",
  "education",
  "award",
];

export async function GET(request: NextRequest) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";
  const type = searchParams.get("type") ?? "";
  const userId = searchParams.get("user_id") ?? "";

  const offset = (page - 1) * limit;

  try {
    let query = supabase!
      .from("member_records")
      .select("*, profiles!member_records_user_id_fkey(name, email)", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    if (type && VALID_RECORD_TYPES.includes(type)) {
      query = query.eq("record_type", type);
    }

    const { data: records, count, error: queryError } = await query;

    if (queryError) {
      console.error("회원 기록 목록 조회 실패:", queryError);
      return NextResponse.json(
        { error: "조회에 실패했습니다." },
        { status: 500 }
      );
    }

    let filteredRecords = records ?? [];
    if (search) {
      const sanitized = search.replace(/[%_\\,()]/g, "").toLowerCase();
      if (sanitized) {
        filteredRecords = filteredRecords.filter((r: Record<string, unknown>) => {
          const profile = r.profiles as { name: string; email: string } | null;
          if (!profile) return false;
          return (
            (profile.name && profile.name.toLowerCase().includes(sanitized)) ||
            (profile.email && profile.email.toLowerCase().includes(sanitized))
          );
        });
      }
    }

    return NextResponse.json({
      records: filteredRecords,
      total: search ? filteredRecords.length : (count ?? 0),
      page,
      limit,
      totalPages: Math.ceil(
        (search ? filteredRecords.length : (count ?? 0)) / limit
      ),
    });
  } catch (err) {
    console.error("회원 기록 목록 조회 오류:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { error, user, supabase } = await verifyAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { user_id, record_type, title, data, memo } = body;

    if (!user_id || !record_type || !title) {
      return NextResponse.json(
        { error: "회원, 기록유형, 제목은 필수입니다." },
        { status: 400 }
      );
    }

    if (!VALID_RECORD_TYPES.includes(record_type)) {
      return NextResponse.json(
        { error: "유효하지 않은 기록 유형입니다." },
        { status: 400 }
      );
    }

    const { data: record, error: insertError } = await supabase!
      .from("member_records")
      .insert({
        user_id,
        record_type,
        title: title.trim(),
        data: data ?? {},
        memo: memo ?? "",
        created_by: user!.id,
      })
      .select("*, profiles!member_records_user_id_fkey(name, email)")
      .single();

    if (insertError) {
      console.error("회원 기록 생성 실패:", insertError);
      return NextResponse.json(
        { error: "기록 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ record }, { status: 201 });
  } catch (err) {
    console.error("회원 기록 생성 오류:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
