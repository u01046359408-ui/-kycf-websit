import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth 콜백 라우트
 * - Supabase OAuth 인증 후 리다이렉트되는 엔드포인트
 * - code를 세션으로 교환
 * - next 파라미터가 있으면 해당 경로로, 없으면 홈으로 리다이렉트
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";

  // open redirect 방지: 상대 경로만 허용, // 시작 차단
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();

    // authorization code를 세션으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 인증 성공 - 지정된 경로로 리다이렉트
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 인증 실패 - 로그인 페이지로 리다이렉트 (에러 표시)
  return NextResponse.redirect(
    `${origin}/login?error=인증에 실패했습니다. 다시 시도해 주세요.`
  );
}
