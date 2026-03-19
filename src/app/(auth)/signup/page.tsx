"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, UserPlus, Loader2 } from "lucide-react";
import { signUpWithEmail, signInWithOAuth } from "@/lib/auth/actions";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 이메일 회원가입 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 클라이언트 측 유효성 검사
    if (!form.name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }

    if (!form.email.trim()) {
      setError("이메일을 입력해 주세요.");
      return;
    }

    if (form.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      setError("필수 약관에 모두 동의해 주세요.");
      return;
    }

    startTransition(async () => {
      const result = await signUpWithEmail(
        form.email,
        form.password,
        form.name,
        form.phone || undefined
      );

      if (result.error) {
        setError(result.error);
      } else {
        // 회원가입 성공 - 이메일 인증 안내 표시
        setSuccess(true);
      }
    });
  };

  // 소셜 로그인 처리
  const handleOAuthSignup = (provider: "kakao" | "google" | "naver") => {
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

  // 회원가입 성공 화면
  if (success) {
    return (
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-[#c9a84c]" />
            </div>
            <h2 className="text-xl font-bold text-white">
              회원가입이 완료되었습니다
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              <span className="text-[#c9a84c]">{form.email}</span> 주소로
              <br />
              인증 메일을 발송했습니다.
              <br />
              이메일을 확인하여 인증을 완료해 주세요.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 px-6 py-2.5 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all"
            >
              로그인 페이지로 이동
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#c9a84c] to-[#e8d48b] bg-clip-text text-transparent">
              한국유소년체스연맹
            </h1>
          </Link>
          <p className="mt-2 text-sm text-gray-400">
            회원가입으로 다양한 서비스를 이용하세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              이름
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                disabled={isPending}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
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
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요 (6자 이상)"
                disabled={isPending}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                disabled={isPending}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              전화번호
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                disabled={isPending}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={isPending}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a84c] focus:ring-[#c9a84c]/50 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                <span className="text-[#c9a84c] underline underline-offset-2">이용약관</span>에 동의합니다 (필수)
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                disabled={isPending}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-[#c9a84c] focus:ring-[#c9a84c]/50 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                <span className="text-[#c9a84c] underline underline-offset-2">개인정보처리방침</span>에 동의합니다 (필수)
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#c9a84c]/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            {isPending ? "가입 처리 중..." : "회원가입"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#111d35] text-gray-400">
              또는 소셜 회원가입
            </span>
          </div>
        </div>

        {/* Social Signup */}
        <div className="flex gap-3">
          <button
            onClick={() => handleOAuthSignup("kakao")}
            disabled={isPending}
            className="flex-1 py-2.5 bg-[#FEE500] text-[#191919] font-medium rounded-lg hover:bg-[#FEE500]/90 transition-colors text-sm disabled:opacity-50"
          >
            카카오
          </button>
          <button
            onClick={() => handleOAuthSignup("google")}
            disabled={isPending}
            className="flex-1 py-2.5 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
          >
            구글
          </button>
          <button
            onClick={() => handleOAuthSignup("naver")}
            disabled={isPending}
            className="flex-1 py-2.5 bg-[#03C75A] text-white font-medium rounded-lg hover:bg-[#03C75A]/90 transition-colors text-sm disabled:opacity-50"
          >
            네이버
          </button>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="text-[#c9a84c] hover:text-[#e8d48b] font-medium transition-colors"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
