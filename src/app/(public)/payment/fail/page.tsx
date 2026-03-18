"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import { XCircle, RefreshCw, Home, Loader2 } from "lucide-react";

function PaymentFailContent() {
  const searchParams = useSearchParams();

  // 토스가 리다이렉트 시 전달하는 에러 파라미터
  const errorCode = searchParams.get("code") || "UNKNOWN_ERROR";
  const errorMessage =
    searchParams.get("message") || "결제 처리 중 문제가 발생했습니다.";

  // 에러 코드별 사용자 안내 메시지
  const getErrorGuide = (code: string): string => {
    switch (code) {
      case "PAY_PROCESS_CANCELED":
        return "결제가 취소되었습니다. 다시 시도해 주세요.";
      case "PAY_PROCESS_ABORTED":
        return "결제가 중단되었습니다. 잠시 후 다시 시도해 주세요.";
      case "REJECT_CARD_COMPANY":
        return "카드사에서 결제가 거절되었습니다. 카드사에 문의하거나 다른 결제 수단을 이용해 주세요.";
      case "EXCEED_MAX_DAILY_PAYMENT_COUNT":
        return "일일 결제 한도를 초과했습니다. 내일 다시 시도해 주세요.";
      case "EXCEED_MAX_AMOUNT":
        return "결제 금액 한도를 초과했습니다. 한도를 확인해 주세요.";
      default:
        return "일시적인 오류가 발생했을 수 있습니다. 다시 시도해 주세요.";
    }
  };

  return (
    <>
      <PageBanner
        title="결제 실패"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "결제", href: "/payment" },
          { label: "결제 실패", href: "/payment/fail" },
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
          {/* 에러 아이콘 */}
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            결제에 실패했습니다
          </h2>
          <p className="text-gray-400 mb-6">{getErrorGuide(errorCode)}</p>

          {/* 에러 정보 */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5 text-left mb-8">
            <h3 className="text-sm font-semibold text-red-400 mb-3">
              오류 정보
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">오류 코드</span>
                <span className="text-white font-mono">{errorCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">오류 사유</span>
                <span className="text-white">{errorMessage}</span>
              </div>
            </div>
          </div>

          {/* 해결 방법 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left mb-8">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              해결 방법
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
                카드 한도 및 잔액을 확인해 주세요.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
                다른 결제 수단을 이용해 보세요.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
                문제가 지속될 경우 고객센터(02-1234-5678)로 문의해 주세요.
              </li>
            </ul>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/certificate"
              className="flex-1 py-3 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#c9a84c]/20"
            >
              <RefreshCw className="w-5 h-5" />
              다시 시도
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Suspense로 감싸서 useSearchParams 지원
export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
