"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// 인증 액션 반환 타입
export interface AuthResult {
  error: string | null;
  success?: boolean;
}

/**
 * 이메일 회원가입
 * - Supabase Auth에 사용자 생성
 * - profiles 테이블에 추가 정보 저장은 DB trigger로 처리
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<AuthResult> {
  const supabase = await createClient();

  // 비밀번호 유효성 검사
  if (password.length < 6) {
    return { error: "비밀번호는 최소 6자 이상이어야 합니다." };
  }

  if (!email || !name) {
    return { error: "이메일과 이름은 필수 입력 항목입니다." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone: phone || null,
      },
    },
  });

  if (error) {
    const message = getKoreanAuthError(error.message);
    return { error: message };
  }

  // 트리거가 실패할 수 있으므로 직접 프로필 생성 시도
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        email: email,
        name: name,
        phone: phone || null,
        role: "user",
        provider: "email",
      }, { onConflict: "id" });

    if (profileError) {
      console.error("프로필 생성 오류 (무시 가능):", profileError.message);
    }
  }

  return { error: null, success: true };
}

/**
 * 이메일 로그인
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = await createClient();

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = getKoreanAuthError(error.message);
    return { error: message };
  }

  return { error: null, success: true };
}

/**
 * 소셜 로그인 (카카오, 구글, 네이버)
 * - OAuth URL을 반환하여 클라이언트에서 리다이렉트 처리
 */
export async function signInWithOAuth(
  provider: "kakao" | "google" | "naver"
): Promise<{ error: string | null; url?: string }> {
  const supabase = await createClient();

  // 콜백 URL 생성 (현재 요청의 origin 사용)
  const headersList = await headers();
  const origin = headersList.get("origin") || headersList.get("referer")?.replace(/\/[^/]*$/, "") || "http://localhost:3000";

  // naver는 Supabase 커스텀 OAuth 프로바이더로 등록해야 함
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as "google" | "kakao",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: getKoreanAuthError(error.message) };
  }

  return { error: null, url: data.url };
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * 비밀번호 재설정 이메일 발송
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = await createClient();

  if (!email) {
    return { error: "이메일을 입력해 주세요." };
  }

  const headersList = await headers();
  const origin = headersList.get("origin") || headersList.get("referer")?.replace(/\/[^/]*$/, "") || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: getKoreanAuthError(error.message) };
  }

  return { error: null, success: true };
}

/**
 * 비밀번호 변경 (로그인된 상태에서)
 */
export async function updatePassword(
  newPassword: string
): Promise<AuthResult> {
  const supabase = await createClient();

  if (newPassword.length < 6) {
    return { error: "비밀번호는 최소 6자 이상이어야 합니다." };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: getKoreanAuthError(error.message) };
  }

  return { error: null, success: true };
}

/**
 * 현재 로그인된 사용자 정보 조회
 * - Supabase Auth 사용자 + profiles 테이블 조회
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // profiles 테이블에서 추가 정보 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name || user.user_metadata?.name || null,
    phone: profile?.phone || user.user_metadata?.phone || null,
    role: profile?.role || "user",
    provider: profile?.provider || "email",
    created_at: profile?.created_at || user.created_at,
  };
}

/**
 * Supabase 인증 에러 메시지를 한국어로 변환
 */
function getKoreanAuthError(message: string): string {
  const errorMap: Record<string, string> = {
    "Invalid login credentials":
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    "Email not confirmed":
      "이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요.",
    "User already registered":
      "이미 등록된 이메일입니다.",
    "Password should be at least 6 characters":
      "비밀번호는 최소 6자 이상이어야 합니다.",
    "Email rate limit exceeded":
      "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.",
    "For security purposes, you can only request this once every 60 seconds":
      "보안을 위해 60초마다 한 번만 요청할 수 있습니다.",
    "New password should be different from the old password.":
      "새 비밀번호는 기존 비밀번호와 달라야 합니다.",
    "Auth session missing!":
      "로그인 세션이 만료되었습니다. 다시 로그인해 주세요.",
    "Signups not allowed for this instance":
      "현재 회원가입이 비활성화되어 있습니다.",
  };

  return errorMap[message] || `인증 오류가 발생했습니다: ${message}`;
}
