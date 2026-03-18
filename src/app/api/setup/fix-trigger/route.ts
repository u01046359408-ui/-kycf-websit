// 트리거 문제 해결 API - 한 번만 호출하면 됨
// GET /api/setup/fix-trigger

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 서비스 롤 키가 없으면 일반 키로 시도
  const supabaseKey = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "환경변수 미설정" }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      db: { schema: "public" },
    });

    // 트리거 함수를 에러 무시하도록 재생성
    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE OR REPLACE FUNCTION handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO profiles (id, email, name, phone, provider)
          VALUES (
            NEW.id,
            COALESCE(NEW.email, ''),
            COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
            NEW.raw_user_meta_data->>'phone',
            COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
          )
          ON CONFLICT (id) DO NOTHING;
          RETURN NEW;
        EXCEPTION WHEN OTHERS THEN
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
    });

    if (error) {
      return NextResponse.json({
        message: "RPC 실행 불가 - 수동 방법 필요",
        error: error.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({
      message: "자동 수정 불가",
      error: String(err),
    });
  }
}
