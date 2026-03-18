"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

// 최초 관리자 설정 페이지
// 관리자가 한 명도 없을 때만 사용 가능
export default function AdminSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSetup = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
        // 3초 후 관리자 페이지로 이동
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 2000);
      } else {
        setResult({ success: false, message: data.error });
      }
    } catch {
      setResult({
        success: false,
        message: "서버 연결에 실패했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
          {/* 아이콘 */}
          <div className="w-16 h-16 bg-[#c9a84c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-[#c9a84c]" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            관리자 설정
          </h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            현재 로그인한 계정을 관리자로 설정합니다.<br />
            관리자가 이미 등록되어 있으면 사용할 수 없습니다.
          </p>

          {/* 결과 메시지 */}
          {result && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 text-left ${
                result.success
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-red-500/10 border border-red-500/20"
              }`}
            >
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  result.success ? "text-green-300" : "text-red-300"
                }`}
              >
                {result.message}
              </p>
            </div>
          )}

          {/* 설정 버튼 */}
          {!result?.success && (
            <button
              onClick={handleSetup}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#c9a84c]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  설정 중...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  관리자로 설정하기
                </>
              )}
            </button>
          )}

          {/* 성공 시 이동 버튼 */}
          {result?.success && (
            <Link
              href="/admin"
              className="w-full inline-flex items-center justify-center py-3 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all duration-300 shadow-lg shadow-[#c9a84c]/20"
            >
              관리자 페이지로 이동
            </Link>
          )}

          {/* 안내 */}
          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg text-left">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">사용 방법</h3>
            <ol className="space-y-1.5 text-xs text-gray-400">
              <li className="flex gap-2">
                <span className="text-[#c9a84c]">1.</span>
                회원가입 후 로그인합니다
              </li>
              <li className="flex gap-2">
                <span className="text-[#c9a84c]">2.</span>
                이 페이지에서 &quot;관리자로 설정하기&quot; 클릭
              </li>
              <li className="flex gap-2">
                <span className="text-[#c9a84c]">3.</span>
                /admin 페이지에서 사이트를 관리합니다
              </li>
              <li className="flex gap-2">
                <span className="text-[#c9a84c]">4.</span>
                추가 관리자는 회원관리에서 역할 변경
              </li>
            </ol>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
