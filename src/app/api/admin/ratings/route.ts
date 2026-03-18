/**
 * 관리자 선수 레이팅 API
 * GET  /api/admin/ratings - 전체 레이팅 조회 (비활성 포함)
 * POST /api/admin/ratings - 새 선수 등록
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const region = searchParams.get("region") || "";
    const sort = searchParams.get("sort") || "rating_desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const showAll = searchParams.get("showAll") === "true";
    const offset = (page - 1) * limit;

    let query = supabase!
      .from("player_ratings")
      .select("*", { count: "exact" });

    // 활성/비활성 필터
    if (!showAll) {
      query = query.eq("is_active", true);
    }

    // 검색 필터
    if (search) {
      query = query.or(`name.ilike.%${search}%,member_code.ilike.%${search}%`);
    }

    // 지역 필터
    if (region) {
      query = query.eq("region", region);
    }

    // 정렬
    switch (sort) {
      case "rating_asc":
        query = query.order("rating", { ascending: true });
        break;
      case "name":
        query = query.order("name", { ascending: true });
        break;
      case "rating_desc":
      default:
        query = query.order("rating", { ascending: false });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error: queryError, count } = await query;

    if (queryError) {
      console.error("[Admin Ratings] 조회 오류:", queryError);
      return NextResponse.json(
        { error: "레이팅 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: data ?? [],
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err) {
    console.error("[Admin Ratings] 서버 오류:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { error, user, supabase } = await verifyAdmin();
  if (error) return error;

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
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "성명은 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 회원코드 자동생성
    let finalMemberCode = member_code;
    if (!finalMemberCode) {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      finalMemberCode = `KYCF-${randomPart}`;
    }

    // 회원코드 중복 확인
    const { data: existing } = await supabase!
      .from("player_ratings")
      .select("id")
      .eq("member_code", finalMemberCode)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "이미 사용 중인 회원코드입니다." },
        { status: 409 }
      );
    }

    const { data, error: insertError } = await supabase!
      .from("player_ratings")
      .insert({
        member_code: finalMemberCode,
        name,
        region: region || "",
        rating: rating ?? 1000,
        grade: grade || "",
        birth_date: birth_date || null,
        gender: gender || "",
        organization: organization || "",
        wins: wins ?? 0,
        losses: losses ?? 0,
        draws: draws ?? 0,
        last_competition: last_competition || "",
        last_competition_date: last_competition_date || null,
        user_id: user_id || null,
        created_by: user!.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Admin Ratings] 등록 오류:", insertError);
      return NextResponse.json(
        { error: "선수 등록에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[Admin Ratings] 서버 오류:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
