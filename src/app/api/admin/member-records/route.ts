// 관리자 회원 기록 목록 조회 및 생성 API
// GET /api/admin/member-records - 목록 조회 (검색, 페이지네이션, 유형 필터, user_id 필터)
// POST /api/admin/member-records - 새 기록 생성

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
  const recordType = searchParams.get("record_type") ?? "";
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

    // user_id 필터
    if (userId) {
      query = query.eq("user_id", userId);
    }

    // 기록 유형 필터
    if (recordType && VALID_RECORD_TYPES.includes(recordType)) {
      query = query.eq("record_type", recordType);
    }

    const { data: records, count, error: queryError } = await query;

    if (queryError) {
      console.error("회원 기록 목록 조회 실패:", queryError);
      return NextResponse.json(
        { error: "조회에 실패했습니다." },
        { status: 500 }
      );
    }

    // search 파라미터가 있으면 join된 profiles.name/email로 클라이언트 사이드 필터
    // (Supabase에서 join된 컬럼에 대한 ilike 필터가 제한적이므로)
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

    // 필수 필드 검증
    if (!user_id || !record_type || !title) {
      return NextResponse.json(
        { error: "회원, 기록유형, 제목은 필수입니다." },
        { status: 400 }
      );
    }

    // 기록 유형 유효성 검증
    if (!VALID_RECORD_TYPES.includes(record_type)) {
      return NextResponse.json(
        { error: "유효하지 않은 기록 유형입니다." },
        { status: 400 }
      );
    }

    // 회원 존재 여부 확인
    const { data: profile, error: profileError } = await supabase!
      .from("profiles")
      .select("id")
      .eq("id", user_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "존재하지 않는 회원입니다." },
        { status: 404 }
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
