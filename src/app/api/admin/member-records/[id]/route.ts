// 관리자 회원 기록 단건 조회/수정/삭제 API
// GET /api/admin/member-records/[id] - 단일 기록 조회
// PUT /api/admin/member-records/[id] - 기록 수정
// DELETE /api/admin/member-records/[id] - 기록 삭제

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

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { id } = await context.params;

  try {
    const { data: record, error: queryError } = await supabase!
      .from("member_records")
      .select("*, profiles!member_records_user_id_fkey(name, email)")
      .eq("id", id)
      .single();

    if (queryError || !record) {
      return NextResponse.json(
        { error: "기록을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ record });
  } catch (err) {
    console.error("회원 기록 조회 오류:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { id } = await context.params;

  try {
    const body = await request.json();
    const { user_id, record_type, title, data, memo } = body;

    // 업데이트할 필드 구성 (전달된 필드만 업데이트)
    const updateFields: Record<string, unknown> = {};

    if (user_id !== undefined) {
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
      updateFields.user_id = user_id;
    }
    if (record_type !== undefined) {
      if (!VALID_RECORD_TYPES.includes(record_type)) {
        return NextResponse.json(
          { error: "유효하지 않은 기록 유형입니다." },
          { status: 400 }
        );
      }
      updateFields.record_type = record_type;
    }
    if (title !== undefined) {
      updateFields.title = title.trim();
    }
    if (data !== undefined) {
      updateFields.data = data;
    }
    if (memo !== undefined) {
      updateFields.memo = memo;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "수정할 내용이 없습니다." },
        { status: 400 }
      );
    }

    const { data: record, error: updateError } = await supabase!
      .from("member_records")
      .update(updateFields)
      .eq("id", id)
      .select("*, profiles!member_records_user_id_fkey(name, email)")
      .single();

    if (updateError) {
      console.error("회원 기록 수정 실패:", updateError);
      return NextResponse.json(
        { error: "기록 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    if (!record) {
      return NextResponse.json(
        { error: "기록을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ record });
  } catch (err) {
    console.error("회원 기록 수정 오류:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { id } = await context.params;

  try {
    const { error: deleteError } = await supabase!
      .from("member_records")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("회원 기록 삭제 실패:", deleteError);
      return NextResponse.json(
        { error: "기록 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("회원 기록 삭제 오류:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
