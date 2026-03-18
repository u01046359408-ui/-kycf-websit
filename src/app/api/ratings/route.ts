/**
 * 공개 선수 레이팅 API
 * GET /api/ratings
 *
 * 활성 선수 레이팅을 조회합니다. 인증 불필요.
 * Query params: search, region, sort (rating_desc, rating_asc, name), page, limit
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const region = searchParams.get("region") || "";
    const sort = searchParams.get("sort") || "rating_desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    // 기본 쿼리: 활성 선수만
    let query = supabase
      .from("player_ratings")
      .select("*", { count: "exact" })
      .eq("is_active", true);

    // 검색 필터 (이름 또는 회원코드)
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

    // 페이지네이션
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[Ratings] 조회 오류:", error);
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
  } catch (error) {
    console.error("[Ratings] 서버 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
