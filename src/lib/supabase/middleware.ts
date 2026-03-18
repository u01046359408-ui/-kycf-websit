import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 로그인이 필요한 경로
const PROTECTED_ROUTES = ["/mypage", "/payment", "/certificates"];

// 관리자 전용 경로
const ADMIN_ROUTES = ["/admin"];

// 로그인한 사용자가 접근하면 안 되는 경로
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export async function updateSession(request: NextRequest) {
  // 환경변수가 없거나 placeholder면 미들웨어 건너뜀
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL.includes("placeholder")) {
    return NextResponse.next();
  }

  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // 세션 갱신 — 에러가 나도 크래시하지 않음
    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      // 세션 갱신 실패 (Lock broken 등) — 무시하고 계속 진행
      return supabaseResponse;
    }

    const pathname = request.nextUrl.pathname;

    // 보호된 라우트 체크
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute && !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 관리자 라우트 체크
    const isAdminRoute = ADMIN_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute) {
      if (pathname === "/admin/setup") {
        if (!user) {
          const loginUrl = new URL("/login", request.url);
          loginUrl.searchParams.set("redirect", pathname);
          return NextResponse.redirect(loginUrl);
        }
        return supabaseResponse;
      }

      if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!profile || profile.role !== "admin") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch {
        // DB 조회 실패 시 홈으로
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // 인증 라우트 체크
    const isAuthRoute = AUTH_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return supabaseResponse;
  } catch {
    // 전체 미들웨어 에러 시 그냥 통과시킴 (사이트 크래시 방지)
    return NextResponse.next();
  }
}
