import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 관리자 증명서 목록 조회
export async function GET(request: NextRequest) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? "";
  const templateId = searchParams.get("template_id") ?? "";

  const offset = (page - 1) * limit;

  try {
    let query = supabase!
      .from("certificates")
      .select(
        "*, template:certificate_templates!certificates_template_id_fkey(name, type)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // 검색 (일련번호 또는 신청자명, 입력값 sanitize)
    if (search) {
      const sanitized = search.replace(/[%_\\,()]/g, "");
      if (sanitized) {
        query = query.or(
          `serial_number.ilike.%${sanitized}%,applicant_name.ilike.%${sanitized}%`
        );
      }
    }

    // 템플릿 필터
    if (templateId) {
      query = query.eq("template_id", templateId);
    }

    const { data: certificates, count } = await query;

    return NextResponse.json({
      certificates: certificates ?? [],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    });
  } catch (err) {
    console.error("증명서 목록 조회 실패:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
