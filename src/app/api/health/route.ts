import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 5분마다 외부 크론잡이 호출하여 Supabase 절전 모드 방지
export async function GET() {
  try {
    const supabase = await createClient();
    // 가벼운 쿼리로 Supabase 깨우기
    await supabase.from("profiles").select("id").limit(1);
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  }
}
