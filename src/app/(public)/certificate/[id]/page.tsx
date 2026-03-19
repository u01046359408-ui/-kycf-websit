"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import LoginModal from "@/components/ui/LoginModal";
import { User, Calendar, Phone, FileText, CreditCard, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const certificateData: Record<
  string,
  { name: string; description: string; price: number; details: string }
> = {
  qualification: {
    name: "자격증명서",
    description: "한국유소년체스연맹에서 취득한 자격증에 대한 공식 증명서",
    price: 5000,
    details:
      "본 증명서는 한국유소년체스연맹에서 시행하는 자격시험에 합격하여 취득한 자격을 공식적으로 증명하는 문서입니다. 자격증 번호, 취득일자, 자격 종류 등이 기재됩니다.",
  },
  career: {
    name: "경력증명서",
    description: "한국유소년체스연맹 관련 경력사항 공식 증명",
    price: 3000,
    details:
      "한국유소년체스연맹과 관련된 경력 사항을 공식적으로 증명하는 문서입니다. 근무기간, 직위, 담당업무 등이 기재됩니다.",
  },
  completion: {
    name: "수료증명서",
    description: "교육과정 수료 사실 증명",
    price: 3000,
    details:
      "한국유소년체스연맹에서 운영하는 교육과정을 정상적으로 수료한 사실을 증명하는 문서입니다. 교육과정명, 교육기간, 수료일자 등이 기재됩니다.",
  },
  transcript: {
    name: "성적증명서",
    description: "교육과정 성적 및 평가 결과 확인",
    price: 3000,
    details:
      "교육과정에서 이수한 과목별 성적 및 평가 결과를 확인할 수 있는 증명서입니다. 과목명, 학점, 성적 등이 기재됩니다.",
  },
  employment: {
    name: "재직증명서",
    description: "한국유소년체스연맹 소속 재직 사실 증명",
    price: 2000,
    details:
      "한국유소년체스연맹에 소속되어 재직 중인 사실을 공식적으로 증명하는 문서입니다. 입사일, 현 직위, 소속 부서 등이 기재됩니다.",
  },
  education: {
    name: "교육이수증명서",
    description: "특정 교육 프로그램 이수 사실 증명",
    price: 3000,
    details:
      "한국유소년체스연맹에서 운영하는 특정 교육 프로그램을 이수한 사실을 증명하는 문서입니다. 프로그램명, 이수시간, 이수일자 등이 기재됩니다.",
  },
};

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const cert = certificateData[id];

  const [submitting, setSubmitting] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    phone: "",
    purpose: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 결제 요청 처리 (토스 결제창 바로 열기)
  const processPayment = async () => {
    setSubmitting(true);
    try {
      // 1. 서버에 결제 주문 생성
      const res = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateId: id,
          applicantName: form.name,
          applicantBirthDate: form.birthDate,
          applicantPhone: form.phone,
          purpose: form.purpose,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "결제 주문 생성에 실패했습니다.");
        return;
      }

      const orderData = await res.json();

      // 2. 토스페이먼츠 결제창 열기
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        alert("결제 시스템 설정 오류가 발생했습니다.");
        return;
      }

      const { loadTossPayments } = await import("@tosspayments/tosspayments-sdk");
      const tossPayments = await loadTossPayments(clientKey);

      // @ts-expect-error - 토스 SDK 타입 정의 불일치
      await tossPayments.requestPayment("카드", {
        amount: cert!.price,
        orderId: orderData.orderId,
        orderName: orderData.orderName,
        customerName: orderData.customerName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("USER_CANCEL")) {
        // 사용자가 결제 취소 — 무시
      } else {
        console.error("결제 오류:", err);
        alert("결제 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 로그인 체크
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoginModalOpen(true);
        return;
      }

      // 로그인 상태 → 바로 결제 처리
      await processPayment();
    } catch {
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  // 로그인 성공 후 결제 자동 진행
  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    processPayment();
  };

  if (!cert) {
    return (
      <>
        <PageBanner
          title="증명서 발급"
          breadcrumb={[
            { label: "홈", href: "/" },
            { label: "증명서 발급", href: "/certificate" },
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400">해당 증명서를 찾을 수 없습니다.</p>
          <Link
            href="/certificate"
            className="mt-4 inline-block text-[#c9a84c] hover:text-[#e8d48b] transition-colors"
          >
            증명서 목록으로 돌아가기
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title={cert.name}
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "증명서 발급", href: "/certificate" },
          { label: cert.name, href: `/certificate/${id}` },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* 증명서 정보 */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-24">
              <div className="w-14 h-14 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-[#c9a84c]" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{cert.name}</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                {cert.details}
              </p>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">발급 수수료</span>
                  <span className="text-white font-semibold">
                    {cert.price.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">발급 형태</span>
                  <span className="text-white">PDF 파일</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">발급 소요시간</span>
                  <span className="text-white">결제 후 즉시</span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-[#c9a84c]/5 border border-[#c9a84c]/10 rounded-lg">
                <p className="text-xs text-[#d4b85c] leading-relaxed">
                  발급된 증명서는 마이페이지에서 언제든 다시 다운로드 받으실 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 신청 폼 */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">
                신청 정보 입력
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    신청자 이름
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="이름을 입력하세요"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    생년월일
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="date"
                      name="birthDate"
                      value={form.birthDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    연락처
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="010-0000-0000"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    발급 목적
                  </label>
                  <select
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#1a2744]">
                      발급 목적을 선택하세요
                    </option>
                    <option value="취업" className="bg-[#1a2744]">취업</option>
                    <option value="진학" className="bg-[#1a2744]">진학</option>
                    <option value="관공서 제출" className="bg-[#1a2744]">관공서 제출</option>
                    <option value="개인 보관" className="bg-[#1a2744]">개인 보관</option>
                    <option value="기타" className="bg-[#1a2744]">기타</option>
                  </select>
                </div>

                {/* 결제 금액 + 버튼 */}
                <div className="border-t border-white/10 pt-5 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300 font-medium">결제 금액</span>
                    <span className="text-2xl font-bold text-[#c9a84c]">
                      {cert.price.toLocaleString()}원
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#c9a84c]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        처리 중...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        결제하기
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 로그인 모달 - 결제하기 클릭 시 미로그인이면 표시 */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        message="증명서 결제를 위해 로그인이 필요합니다"
      />
    </>
  );
}
