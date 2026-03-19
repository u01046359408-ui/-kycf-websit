import PageBanner from "@/components/layout/PageBanner";
import {
  AlertTriangle,
  Eye,
  HandHeart,
  Heart,
  Scale,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata = {
  title: "윤리강령 - 한국유소년체스연맹",
  description: "한국유소년체스연맹 윤리강령, 공정 경쟁 원칙, 징계 규정에 대한 안내입니다.",
};

const coreValues = [
  {
    icon: Scale,
    title: "공정성",
    description:
      "모든 평가와 심사는 객관적이고 공정한 기준에 따라 이루어져야 하며, 어떠한 차별이나 편견도 배제합니다.",
  },
  {
    icon: Eye,
    title: "투명성",
    description:
      "평가 기준, 절차, 결과를 투명하게 공개하여 모든 이해관계자가 신뢰할 수 있는 제도를 운영합니다.",
  },
  {
    icon: Shield,
    title: "정직성",
    description:
      "모든 참가자와 관계자는 정직과 성실을 바탕으로 행동하며, 어떠한 형태의 부정행위도 용납하지 않습니다.",
  },
  {
    icon: Heart,
    title: "존중",
    description:
      "모든 참가자의 노력과 역량을 존중하며, 상호 간의 예의와 배려를 기본으로 합니다.",
  },
  {
    icon: Users,
    title: "협력",
    description:
      "건전한 경쟁을 통해 서로의 성장을 도모하며, 공동의 발전을 위해 협력하는 문화를 지향합니다.",
  },
  {
    icon: Sparkles,
    title: "탁월성",
    description:
      "끊임없는 자기 계발과 전문성 향상을 추구하며, 최고 수준의 역량을 갖추기 위해 노력합니다.",
  },
];

const fairPlayPrinciples = [
  {
    number: "01",
    title: "정정당당한 경쟁",
    content:
      "모든 참가자는 자신의 실력과 노력만으로 정당하게 경쟁해야 합니다. 타인의 성과물을 도용하거나 부정한 방법으로 이득을 취하는 행위는 금지됩니다.",
  },
  {
    number: "02",
    title: "규정 준수",
    content:
      "모든 대회 및 평가 활동에서 정해진 규정과 절차를 성실히 준수해야 합니다. 규정의 취지를 이해하고, 형식적 준수를 넘어 실질적 이행에 힘써야 합니다.",
  },
  {
    number: "03",
    title: "상호 존중",
    content:
      "경쟁 상대, 심사위원, 운영 관계자 모두에게 예의를 갖추고 존중하는 태도를 유지해야 합니다. 비하, 모욕, 위협 등의 행위는 어떠한 상황에서도 용납되지 않습니다.",
  },
  {
    number: "04",
    title: "결과에 대한 수용",
    content:
      "공정한 절차에 따른 평가 결과를 겸허히 수용해야 합니다. 이의가 있는 경우 정해진 절차에 따라 정당하게 이의를 제기할 수 있으며, 비합리적인 항의는 자제해야 합니다.",
  },
  {
    number: "05",
    title: "사회적 책임",
    content:
      "인증 보유자로서 사회적 책임을 인식하고, 전문 분야에서 윤리적이고 책임감 있는 활동을 해야 합니다. 인증의 가치를 훼손하는 행위는 금지됩니다.",
  },
  {
    number: "06",
    title: "개인정보 보호",
    content:
      "대회 및 평가 과정에서 취득한 타인의 개인정보를 보호하고, 이를 무단으로 수집, 이용, 유출하는 행위를 금지합니다.",
  },
];

const disciplinaryRules = [
  {
    level: "1단계",
    action: "구두 경고",
    description: "경미한 규정 위반 또는 비매너 행위",
    examples: "지각, 경기장 내 소란, 경미한 에티켓 위반",
    consequence: "기록 보관, 반복 시 상위 단계 적용",
  },
  {
    level: "2단계",
    action: "서면 경고",
    description: "반복적 경미 위반 또는 중간 수준의 규정 위반",
    examples: "2회 이상 구두 경고, 비매너 행위 지속, 경미한 부정행위",
    consequence: "서면 경고 2회 누적 시 3단계 적용",
  },
  {
    level: "3단계",
    action: "해당 대회 실격",
    description: "명백한 부정행위 또는 중대한 규정 위반",
    examples: "모사 행위, 허용되지 않은 도구 사용, 타인 방해",
    consequence: "해당 대회 모든 성적 무효 처리",
  },
  {
    level: "4단계",
    action: "자격 정지 (6개월~2년)",
    description: "악의적 부정행위 또는 반복적 중대 위반",
    examples: "대리 응시, 심사위원 매수 시도, 반복적 부정행위",
    consequence: "정지 기간 중 모든 대회 참가 불가, 인증 갱신 불가",
  },
  {
    level: "5단계",
    action: "인증 취소 및 영구 제명",
    description: "극히 중대한 위반으로 인증 제도의 근간을 훼손하는 행위",
    examples: "조직적 부정행위, 인증서 위변조, 심각한 사회적 물의",
    consequence: "인증 취소, 재인증 불가, 법적 조치 병행 가능",
  },
];

export default function EthicsPage() {
  return (
    <>
      <PageBanner
        title="윤리강령"
        breadcrumb={[
          { label: "HOME", href: "/" },
          { label: "종목정보", href: "/info" },
          { label: "윤리강령", href: "/info/ethics" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Preamble */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-[#c9a84c]/10 via-[#1a2744] to-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-2xl p-8 sm:p-10 text-center">
            <HandHeart className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              한국유소년체스연맹 윤리강령 전문
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-3xl mx-auto text-sm sm:text-base">
              한국유소년체스연맹는 공정하고 투명한 인재 인증 제도의 운영을 통해 대한민국의
              인재 육성에 기여합니다. 우리는 모든 참가자의 권리를 존중하며, 정직과
              성실을 바탕으로 한 건전한 경쟁 문화를 조성합니다. 본 윤리강령은
              한국유소년체스연맹의 모든 구성원, 참가자, 심사위원, 관계자가 준수해야 할
              행동 규범을 명시하며, 이를 통해 인증 제도의 신뢰성과 가치를
              보전합니다.
            </p>
          </div>
        </section>

        {/* Section 1: Code of Ethics / Core Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              핵심 가치
            </h2>
            <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              한국유소년체스연맹가 추구하는 6가지 핵심 가치입니다. 모든 활동의 기반이 되는
              원칙입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#c9a84c]/30 transition-all duration-300 group text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                  <value.icon className="w-7 h-7 text-[#c9a84c]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Fair Play Principles */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              공정 경쟁 원칙
            </h2>
            <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              모든 참가자와 관계자가 지켜야 할 공정 경쟁의 원칙입니다.
            </p>
          </div>

          <div className="space-y-4">
            {fairPlayPrinciples.map((principle) => (
              <div
                key={principle.number}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#c9a84c]/30 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#d4b85c] flex items-center justify-center text-[#0a1628] font-bold text-sm shrink-0">
                    {principle.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {principle.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Disciplinary Rules */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              징계 규정
            </h2>
            <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              윤리강령 및 규정 위반 시 적용되는 단계별 징계 조치입니다.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-5 gap-4 px-6 py-4 bg-[#c9a84c]/10 border-b border-white/10">
              <span className="text-sm font-semibold text-[#c9a84c]">
                단계
              </span>
              <span className="text-sm font-semibold text-[#c9a84c]">
                조치
              </span>
              <span className="text-sm font-semibold text-[#c9a84c]">
                해당 사유
              </span>
              <span className="text-sm font-semibold text-[#c9a84c]">
                위반 예시
              </span>
              <span className="text-sm font-semibold text-[#c9a84c]">
                후속 조치
              </span>
            </div>

            {/* Table rows - responsive */}
            {disciplinaryRules.map((rule, index) => (
              <div
                key={rule.level}
                className={`px-6 py-5 ${
                  index < disciplinaryRules.length - 1
                    ? "border-b border-white/5"
                    : ""
                } hover:bg-white/5 transition-colors duration-200`}
              >
                {/* Desktop */}
                <div className="hidden lg:grid grid-cols-5 gap-4">
                  <div>
                    <span className="text-sm font-bold text-white">
                      {rule.level}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-[#d4b85c] font-semibold">
                      {rule.action}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">
                      {rule.description}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">
                      {rule.examples}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">
                      {rule.consequence}
                    </span>
                  </div>
                </div>

                {/* Mobile */}
                <div className="lg:hidden space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">
                      {rule.level}
                    </span>
                    <span className="text-sm text-[#d4b85c] font-semibold">
                      {rule.action}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{rule.description}</p>
                  <p className="text-xs text-gray-500">
                    <span className="text-gray-400">예시:</span>{" "}
                    {rule.examples}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="text-gray-400">후속 조치:</span>{" "}
                    {rule.consequence}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Warning notice */}
          <div className="mt-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-white mb-2">
                  유의사항
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
                    <span>
                      징계 사유 발생 시 당사자에게 소명 기회를 부여하며, 징계
                      결정은 징계위원회의 심의를 거쳐 확정됩니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
                    <span>
                      징계 결정에 이의가 있는 경우, 결정 통보 후 14일 이내에
                      재심을 요청할 수 있습니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
                    <span>
                      자격 정지 기간이 만료된 후에도 재발 방지 교육 이수를
                      완료해야 활동을 재개할 수 있습니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
                    <span>
                      부정행위 제보는 익명으로 가능하며, 제보자의 신원은 철저히
                      보호됩니다.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
