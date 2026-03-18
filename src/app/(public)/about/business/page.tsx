import PageBanner from "@/components/layout/PageBanner";
import { GraduationCap, FileCheck, Handshake, Lightbulb } from "lucide-react";

export const metadata = {
  title: "주요사업 - 대한인재",
};

const businesses = [
  {
    icon: FileCheck,
    title: "자격 인증 사업",
    description:
      "산업 현장에서 요구되는 전문 자격 시험을 개발하고 운영합니다. 공정하고 투명한 평가 체계를 통해 개인의 역량을 객관적으로 인증하며, 국가공인 민간자격 및 등록 민간자격을 포함한 다양한 자격 종목을 관리합니다.",
    highlights: ["국가공인 민간자격 운영", "CBT 시험 시스템", "자격증 발급 및 관리"],
  },
  {
    icon: GraduationCap,
    title: "교육 연수 사업",
    description:
      "직무 능력 향상을 위한 전문 교육 과정을 설계하고 운영합니다. 온라인과 오프라인을 아우르는 블렌디드 러닝 방식을 채택하여 시간과 장소에 구애받지 않는 학습 환경을 제공합니다.",
    highlights: ["직무 전문 교육", "온·오프라인 통합 과정", "맞춤형 기업 연수"],
  },
  {
    icon: Handshake,
    title: "산학 협력 사업",
    description:
      "대학, 기업, 정부 기관과의 협력을 통해 산업 현장이 필요로 하는 인재를 양성합니다. 취업 연계 프로그램과 인턴십을 운영하여 청년 일자리 창출에 기여합니다.",
    highlights: ["산학 연계 프로그램", "취업 지원 서비스", "기업 맞춤형 인재 추천"],
  },
  {
    icon: Lightbulb,
    title: "연구 개발 사업",
    description:
      "미래 산업에 대응하는 교육 콘텐츠와 평가 도구를 연구·개발합니다. AI, 빅데이터 등 신기술 분야의 자격 체계 개발과 교육 방법론 혁신에 앞장서고 있습니다.",
    highlights: ["교육 콘텐츠 R&D", "평가 도구 개발", "신기술 자격 체계 연구"],
  },
];

export default function BusinessPage() {
  return (
    <>
      <PageBanner
        title="주요사업"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "대한인재", href: "/about" },
          { label: "주요사업", href: "/about/business" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          대한인재는 인재 양성의 전 과정을 아우르는 4대 핵심 사업을 운영하고
          있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map((biz) => (
            <div
              key={biz.title}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 hover:border-[#c9a84c]/30 hover:bg-white/[0.06] transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center mb-5 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                <biz.icon className="w-7 h-7 text-[#c9a84c]" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {biz.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                {biz.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2">
                {biz.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
