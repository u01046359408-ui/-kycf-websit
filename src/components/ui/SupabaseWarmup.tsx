"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * 페이지 로드 시 Supabase에 미리 요청을 보내서 절전 모드를 깨움
 * 사용자에게는 아무것도 보이지 않음
 */
export default function SupabaseWarmup() {
  useEffect(() => {
    const supabase = createClient();
    // 가벼운 요청으로 Supabase 깨우기
    supabase.auth.getSession().catch(() => {});
  }, []);

  return null;
}
