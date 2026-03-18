/**
 * 관리자 개별 선수 레이팅 API
 * GET    /api/admin/ratings/[id] - 단일 조회
 * PUT    /api/admin/ratings/[id] - 수정
 * DELETE /api/admin/ratings/[id] - 삭제
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const { data, error: queryError } = await supabase!
      .from("player_ratings")
      .select("*")
      .eq("id", id)
      .single();

    if (queryError || !data) {
      return NextResponse.json(
        { error: "선수 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[Admin Ratings] 조회 오류:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();

    const {
      member_code,
      name,
      region,
      rating,
      grade,
      birth_date,
      gender,
      organization,
      wins,
      losses,
      draws,
      last_competition,
      last_competition_date,
      user_id,
      is_active,
    } = body;

    // 회원코드 중복 확인 (다른 선수와)
    if (member_code) {
      const { data: existing } = await supabase!
        .from("player_ratings")
        .select("id")
        .eq("member_code", member_code)
        .neq("id", id)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "이미 사용 중인 회원코드입니다." },
          { status: 409 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (member_code !== undefined) updateData.member_code = member_code;
    if (name !== undefined) updateData.name = name;
    if (region !== undefined) updateData.region = region;
    if (rating !== undefined) updateData.rating = rating;
    if (grade !== undefined) updateData.grade = grade;
    if (birth_date !== undefined) updateData.birth_date = birth_date || null;
    if (gender !== undefined) updateData.gender = gender;
    if (organization !== undefined) updateData.organization = organization;
    if (wins !== undefined) updateData.wins = wins;
    if (losses !== undefined) updateData.losses = losses;
    if (draws !== undefined) updateData.draws = draws;
    if (last_competition !== undefined) updateData.last_competition = last_competition;
    if (last_competition_date !== undefined) updateData.last_competition_date = last_competition_date || null;
    if (user_id !== undefined) updateData.user_id = user_id || null;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error: updateError } = await supabase!
      .from("player_ratings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[Admin Ratings] 수정 오류:", updateError);
      return NextResponse.json(
        { error: "선수 정보 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "선수 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[Admin Ratings] 서버 오류:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const { error: deleteError } = await supabase!
      .from("player_ratings")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Admin Ratings] 삭제 오류:", deleteError);
      return NextResponse.json(
        { error: "선수 삭제에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Ratings] 서버 오류:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
