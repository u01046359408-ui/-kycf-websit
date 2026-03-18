"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { signInWithEmail, signInWithOAuth } from "@/lib/auth/actions";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 에러 메시지 표시 (OAuth 콜백 실패 등)
  const urlError = searchParams.get("error");

  // 이메일 로그인 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signInWithEmail(email, password);

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    });
  };

  // 소셜 로그인 처리
  const handleOAuthLogin = (provider: "kakao" | "google" | "naver") => {
    setError(null);

    startTransition(async () => {
      const result = await signInWithOAuth(provider);

      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    });
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#c9a84c] to-[#e8d48b] bg-clip-text text-transparent">
              대한인재
            </h1>
          </Link>
          <p className="mt-2 text-sm text-gray-400">
            인재 육성의 중심, 대한인재에 오신 것을 환영합니다
          </p>
        </div>

        {/* 에러 메시지 */}
        {(error || urlError) && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error || urlError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                disabled={isPending}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                disabled={isPending}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#c9a84c]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#111d35] text-gray-400">
              또는 소셜 로그인
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuthLogin("kakao")}
            disabled={isPending}
            className="w-full py-3 bg-[#FEE500] text-[#191919] font-medium rounded-lg hover:bg-[#FEE500]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.041 5.95l-.961 3.568c-.066.245.21.44.424.3L9.58 17.6c.78.128 1.59.196 2.42.196 5.523 0 10-3.477 10-7.796S17.523 3 12 3z" />
            </svg>
            카카오로 로그인
          </button>

          <button
            onClick={() => handleOAuthLogin("google")}
            disabled={isPending}
            className="w-full py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            구글로 로그인
          </button>

          <button
            onClick={() => handleOAuthLogin("naver")}
            disabled={isPending}
            className="w-full py-3 bg-[#03C75A] text-white font-medium rounded-lg hover:bg-[#03C75A]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
            </svg>
            네이버로 로그인
          </button>
        </div>

        {/* Links */}
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <Link
            href="/signup"
            className="text-gray-400 hover:text-[#c9a84c] transition-colors"
          >
            회원가입
          </Link>
          <span className="text-gray-600">|</span>
          <Link
            href="/forgot-password"
            className="text-gray-400 hover:text-[#c9a84c] transition-colors"
          >
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
