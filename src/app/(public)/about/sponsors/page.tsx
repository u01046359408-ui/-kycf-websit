import PageBanner from "@/components/layout/PageBanner";

export const metadata = {
  title: "후원사 - 대한인재",
};

const sponsors = [
  { name: "한국산업인력공단", tier: "platinum" },
  { name: "교육부", tier: "platinum" },
  { name: "고용노동부", tier: "gold" },
  { name: "산업통상자원부", tier: "gold" },
  { name: "한국직업능력연구원", tier: "silver" },
  { name: "대한상공회의소", tier: "silver" },
  { name: "한국경영인증원", tier: "silver" },
  { name: "중소벤처기업부", tier: "silver" },
];

function tierLabel(tier: string) {
  switch (tier) {
    case "platinum":
      return { text: "Platinum", color: "text-gray-200 bg-white/10" };
    case "gold":
      return { text: "Gold", color: "text-[#c9a84c] bg-[#c9a84c]/10" };
    default:
      return { text: "Silver", color: "text-gray-400 bg-white/5" };
  }
}

export default function SponsorsPage() {
  return (
    <>
      <PageBanner
        title="후원사"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "대한인재", href: "/about" },
          { label: "후원사", href: "/about/sponsors" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          대한인재와 함께 대한민국 인재 양성에 힘을 보태주시는 소중한
          후원사입니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsors.map((sponsor) => {
            const tier = tierLabel(sponsor.tier);
            return (
              <div
                key={sponsor.name}
                className="group relative rounded-2xl border border-white/10 bg-[#111d35]/80 p-6 flex flex-col items-center justify-center hover:border-[#c9a84c]/30 transition-colors duration-300"
              >
                {/* Tier badge */}
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${tier.color}`}
                >
                  {tier.text}
                </span>

                {/* Logo placeholder */}
                <div className="w-28 h-28 rounded-xl bg-[#1a2744] border border-white/5 flex items-center justify-center mb-4 group-hover:border-[#c9a84c]/20 transition-colors duration-300">
                  <span className="text-gray-500 text-xs text-center px-2">
                    로고
                  </span>
                </div>

                <p className="text-sm font-medium text-white text-center">
                  {sponsor.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center rounded-2xl border border-white/10 bg-[#1a2744]/60 p-10">
          <h3 className="text-lg font-bold text-white mb-2">
            후원사로 참여하시겠습니까?
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            대한인재와 함께 인재 양성에 동참해 주세요.
          </p>
          <a
            href="mailto:sponsor@daehantalent.kr"
            className="inline-flex items-center px-6 py-2.5 rounded-lg bg-[#c9a84c] text-[#0a1628] text-sm font-semibold hover:bg-[#d4b85c] transition-colors duration-200"
          >
            후원 문의하기
          </a>
        </div>
      </div>
    </>
  );
}
