"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { Shield, Lock, Loader2, AlertCircle, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

const certificateInfo: Record<string, { name: string; price: number }> = {
  qualification: { name: "자격증명서", price: 5000 },
  career: { name: "경력증명서", price: 3000 },
  completion: { name: "수료증명서", price: 3000 },
  transcript: { name: "성적증명서", price: 3000 },
  employment: { name: "재직증명서", price: 2000 },
  education: { name: "교육이수증명서", price: 3000 },
};

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const certId = searchParams.get("id") || "";
  const applicantName = searchParams.get("name") || "";
  const applicantBirthDate = searchParams.get("birthDate") || "";
  const applicantPhone = searchParams.get("phone") || "";
  const purpose = searchParams.get("purpose") || "";

  const cert = certificateInfo[certId];

  // 필수 파라미터 검증
  useEffect(() => {
    if (!certId || !cert) {
      setError("잘못된 접근입니다. 증명서를 다시 선택해 주세요.");
    } else if (!applicantName || !applicantBirthDate || !applicantPhone || !purpose) {
      setError("신청 정보가 누락되었습니다. 증명서 신청 페이지에서 다시 시도해 주세요.");
    }
  }, [certId, cert, applicantName, applicantBirthDate, applicantPhone, purpose]);

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        throw new Error("결제 시스템 설정 오류가 발생했습니다.");
      }

      // 로그인 체크
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      // 서버에 결제 주문 생성 요청
      const requestResponse = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateId: certId,
          applicantName,
          applicantBirthDate,
          applicantPhone,
          purpose,
        }),
      });

      if (!requestResponse.ok) {
        const data = await requestResponse.json();
        throw new Error(data.error || "결제 주문 생성에 실패했습니다.");
      }

      const orderData = await requestResponse.json();

      // 토스페이먼츠 SDK 로드 및 결제 요청
      const tossPayments = await loadTossPayments(clientKey);

      // 일반 결제 방식 사용 (API 개별 연동 키용)
      // @ts-expect-error - 토스 SDK 타입 정의 불일치
      await tossPayments.requestPayment("카드", {
        amount: cert.price,
        orderId: orderData.orderId,
        orderName: orderData.orderName,
        customerName: orderData.customerName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error("결제 오류:", err);
      if (err instanceof Error && err.message.includes("USER_CANCEL")) {
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : "결제 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 에러 상태 (증명서 정보 없음)
  if (error && !cert) {
    return (
      <>
        <PageBanner
          title="결제"
          breadcrumb={[
            { label: "홈", href: "/" },
            { label: "증명서 발급", href: "/certificate" },
            { label: "결제", href: "/payment" },
          ]}
        />
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white rounded-xl card-shadow p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/certificate")}
              className="px-6 py-3 bg-[#2B5BA8] text-white font-semibold rounded-lg hover:bg-[#1E4A8F] transition-colors"
            >
              증명서 목록으로 이동
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title="결제"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "증명서 발급", href: "/certificate" },
          { label: "결제", href: "/payment" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* 결제 영역 */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl card-shadow p-6">
              <h3 className="text-lg font-bold text-[#222] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2B5BA8]" />
                결제 수단
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                결제하기 버튼을 누르면 토스페이먼츠 결제창이 열립니다.
              </p>

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* 보안 안내 */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <Lock className="w-4 h-4" />
                <span>토스페이먼츠 보안 결제 시스템으로 안전하게 처리됩니다.</span>
              </div>

              {/* 결제 버튼 */}
              <button
                onClick={handlePayment}
                disabled={loading || !!error}
                className="w-full py-4 bg-[#2B5BA8] text-white font-semibold rounded-xl hover:bg-[#1E4A8F] transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    결제 처리 중...
                  </>
                ) : (
                  <>{cert?.price.toLocaleString()}원 결제하기</>
                )}
              </button>
            </div>
          </div>

          {/* 주문 내역 요약 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl card-shadow p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[#222] mb-4">주문 내역</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-[#222] font-medium">{cert?.name || "증명서"}</p>
                    <p className="text-sm text-gray-400 mt-1">대한인재 공식 증명서</p>
                  </div>
                  <span className="text-[#222] font-medium whitespace-nowrap ml-4">
                    {cert?.price.toLocaleString()}원
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">신청자</span>
                    <span className="text-[#222]">{applicantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">생년월일</span>
                    <span className="text-[#222]">{applicantBirthDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">연락처</span>
                    <span className="text-[#222]">{applicantPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">발급 목적</span>
                    <span className="text-[#222]">{purpose}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#222] font-semibold">총 결제 금액</span>
                    <span className="text-2xl font-bold text-[#2B5BA8]">
                      {cert?.price.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Shield className="w-4 h-4 text-[#2B5BA8]" />
                  <span>안전한 결제 시스템</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Lock className="w-4 h-4 text-[#2B5BA8]" />
                  <span>개인정보 암호화 처리</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#2B5BA8] animate-spin" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
