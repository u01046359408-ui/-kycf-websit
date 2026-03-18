"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import {
  CheckCircle,
  Download,
  Home,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface PaymentResult {
  success: boolean;
  orderId: string;
  amount: number;
  method: string;
  approvedAt: string;
  receiptUrl: string | null;
  certificate: {
    id: string;
    serialNumber: string;
  } | null;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);

  // 토스가 리다이렉트 시 전달하는 파라미터
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      setError("결제 정보가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    // 결제 승인 요청
    const confirmPayment = async () => {
      try {
        const response = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "결제 승인에 실패했습니다.");
        }

        setResult(data);
      } catch (err) {
        console.error("결제 승인 오류:", err);
        setError(
          err instanceof Error
            ? err.message
            : "결제 승인 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount]);

  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 로딩 중
  if (loading) {
    return (
      <>
        <PageBanner
          title="결제 처리 중"
          breadcrumb={[
            { label: "홈", href: "/" },
            { label: "결제", href: "/payment" },
            { label: "결제 처리 중", href: "/payment/success" },
          ]}
        />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-[#c9a84c] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              결제를 승인하고 있습니다
            </h2>
            <p className="text-gray-400">잠시만 기다려 주세요...</p>
          </div>
        </div>
      </>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <>
        <PageBanner
          title="결제 오류"
          breadcrumb={[
            { label: "홈", href: "/" },
            { label: "결제", href: "/payment" },
            { label: "결제 오류", href: "/payment/success" },
          ]}
        />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              결제 승인에 실패했습니다
            </h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/certificate"
                className="flex-1 py-3 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#c9a84c]/20"
              >
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

  // 성공 상태
  return (
    <>
      <PageBanner
        title="결제 완료"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "결제", href: "/payment" },
          { label: "결제 완료", href: "/payment/success" },
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
          {/* 성공 아이콘 */}
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            결제가 완료되었습니다
          </h2>
          <p className="text-gray-400 mb-8">
            증명서가 성공적으로 발급되었습니다. 아래에서 다운로드 받으실 수
            있습니다.
          </p>

          {/* 주문 상세 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left mb-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              주문 상세
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">주문번호</span>
                <span className="text-white font-mono">
                  {result?.orderId}
                </span>
              </div>
              {result?.certificate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">증명서 번호</span>
                  <span className="text-white font-mono">
                    {result.certificate.serialNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">결제 금액</span>
                <span className="text-[#c9a84c] font-semibold">
                  {result?.amount.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">결제 수단</span>
                <span className="text-white">{result?.method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">결제일시</span>
                <span className="text-white">
                  {result?.approvedAt ? formatDate(result.approvedAt) : "-"}
                </span>
              </div>
              {result?.receiptUrl && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">영수증</span>
                  <a
                    href={result.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c9a84c] hover:text-[#e8d48b] transition-colors"
                  >
                    영수증 보기
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3">
            {result?.certificate && (
              <Link
                href={`/api/certificate/download/${result.certificate.id}`}
                className="flex-1 py-3 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#c9a84c]/20"
              >
                <Download className="w-5 h-5" />
                증명서 다운로드
              </Link>
            )}
            <Link
              href="/"
              className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              홈으로
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            발급된 증명서는{" "}
            <Link
              href="/mypage"
              className="text-[#c9a84c] hover:text-[#e8d48b] transition-colors"
            >
              마이페이지
            </Link>
            에서 언제든 다시 다운로드 받으실 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
}

// Suspense로 감싸서 useSearchParams 지원
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
