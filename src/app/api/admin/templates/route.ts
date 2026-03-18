import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// 증명서 템플릿 목록 조회
export async function GET() {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  try {
    const { data, error: dbError } = await supabase!
      .from("certificate_templates")
      .select("*")
      .order("created_at", { ascending: true });

    if (dbError) throw dbError;

    return NextResponse.json({ templates: data ?? [] });
  } catch (err) {
    console.error("템플릿 목록 조회 실패:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 증명서 템플릿 수정 (가격 변경, 활성/비활성)
export async function PATCH(request: NextRequest) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { id, price, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "템플릿 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 수정할 필드만 포함
    const updateData: Record<string, unknown> = {};
    if (typeof price === "number") {
      if (price < 0) {
        return NextResponse.json(
          { error: "가격은 0 이상이어야 합니다." },
          { status: 400 }
        );
      }
      updateData.price = price;
    }
    if (typeof is_active === "boolean") {
      updateData.is_active = is_active;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "수정할 항목이 없습니다." },
        { status: 400 }
      );
    }

    const { data, error: dbError } = await supabase!
      .from("certificate_templates")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ template: data });
  } catch (err) {
    console.error("템플릿 수정 실패:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
