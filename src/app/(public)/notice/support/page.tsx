"use client";

import PageBanner from "@/components/layout/PageBanner";
import PageEditableWrapper from "@/components/ui/PageEditableWrapper";

const benefits = [
  { title: "세금 혜택", desc: "후원금은 소득세법에 따라 기부금 세액공제 혜택을 받으실 수 있습니다." },
  { title: "후원 감사장", desc: "연간 100만원 이상 후원 시 한국유소년체스연맹 이사장 명의의 감사장을 수여합니다." },
  { title: "행사 초청", desc: "주요 행사 및 포럼에 VIP로 초청되어 네트워킹 기회를 제공받습니다." },
  { title: "소식지 발송", desc: "분기별 한국유소년체스연맹 소식지 및 연간 보고서를 받아보실 수 있습니다." },
];

export default function SupportPage() {
  return (
    <>
      <PageBanner title="후원 및 기부" breadcrumb={[{ label: "홈", href: "/" }, { label: "알림마당", href: "/notice" }, { label: "후원 및 기부", href: "/notice/support" }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <PageEditableWrapper pageKey="support">
          <div className="space-y-16">
            {/* Introduction */}
            <section className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">한국유소년체스연맹와 <span className="text-[#c9a84c]">함께</span>해 주세요</h2>
              <div className="w-16 h-0.5 bg-[#c9a84c] rounded-full mx-auto mb-6" />
              <div className="text-gray-300 leading-relaxed space-y-3">
                <p>(사)한국유소년체스연맹은 대한민국 인재 양성과 직업능력 개발을 위해 노력하고 있습니다. 여러분의 소중한 후원은 청년 취업 지원, 소외 계층 직업교육, 자격검정 제도 발전에 사용됩니다. 작은 관심이 큰 변화를 만듭니다.</p>
              </div>
            </section>

            {/* How to Support */}
            <section>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#c9a84c] rounded-full" />후원 방법</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-[#111d35] border border-white/10 p-6">
                  <h4 className="text-[#c9a84c] font-semibold mb-3">정기 후원</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">매월 일정 금액을 자동이체로 후원하실 수 있습니다. 정기 후원자에게는 연말정산용 기부금 영수증을 일괄 발급해 드립니다. 월 1만원부터 참여 가능합니다.</p>
                </div>
                <div className="rounded-2xl bg-[#111d35] border border-white/10 p-6">
                  <h4 className="text-[#c9a84c] font-semibold mb-3">일시 후원</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">원하시는 금액을 1회 후원하실 수 있습니다. 아래 계좌로 입금 후 사무국으로 연락 주시면 기부금 영수증을 발급해 드립니다.</p>
                </div>
              </div>
            </section>

            {/* Bank Account */}
            <section>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#c9a84c] rounded-full" />후원 계좌 안내</h3>
              <div className="rounded-2xl bg-gradient-to-br from-[#111d35] to-[#1a2744] border border-[#c9a84c]/20 p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><p className="text-gray-400 text-sm mb-1">은행명</p><p className="text-white font-semibold text-lg">국민은행</p></div>
                  <div><p className="text-gray-400 text-sm mb-1">계좌번호</p><p className="text-[#c9a84c] font-semibold text-lg">123-456-789012</p></div>
                  <div><p className="text-gray-400 text-sm mb-1">예금주</p><p className="text-white font-semibold text-lg">(사)한국유소년체스연맹</p></div>
                  <div><p className="text-gray-400 text-sm mb-1">입금 시 참고</p><p className="text-white font-semibold text-lg">성함 + &quot;후원&quot;</p></div>
                </div>
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#c9a84c] rounded-full" />후원자 혜택</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((b, i) => (
                  <div key={i} className="rounded-2xl bg-[#111d35] border border-white/10 p-6 hover:border-[#c9a84c]/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mb-4"><span className="text-[#c9a84c] font-bold text-sm">{String(i + 1).padStart(2, "0")}</span></div>
                    <h4 className="text-white font-semibold mb-2">{b.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#c9a84c] rounded-full" />후원 문의</h3>
              <div className="rounded-2xl bg-[#111d35] border border-white/10 p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div><p className="text-gray-400 text-sm mb-1">담당부서</p><p className="text-white font-medium">사무국 후원팀</p></div>
                  <div><p className="text-gray-400 text-sm mb-1">전화번호</p><p className="text-white font-medium">02-1234-5678</p></div>
                  <div><p className="text-gray-400 text-sm mb-1">이메일</p><p className="text-white font-medium">support@daehantalent.or.kr</p></div>
                </div>
              </div>
            </section>
          </div>
        </PageEditableWrapper>
      </div>
    </>
  );
}
