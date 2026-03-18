import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import { FileText, Award, GraduationCap, BookOpen, Briefcase, ScrollText } from "lucide-react";

export const metadata = {
  title: "증명서 발급 - 대한인재",
};

const certificates = [
  {
    id: "qualification",
    name: "자격증명서",
    description: "대한인재에서 취득한 자격증에 대한 공식 증명서를 발급받으실 수 있습니다.",
    price: 5000,
    icon: Award,
  },
  {
    id: "career",
    name: "경력증명서",
    description: "대한인재 관련 경력사항을 공식적으로 증명하는 문서입니다.",
    price: 3000,
    icon: Briefcase,
  },
  {
    id: "completion",
    name: "수료증명서",
    description: "교육과정 수료 사실을 증명하는 공식 문서를 발급받으실 수 있습니다.",
    price: 3000,
    icon: GraduationCap,
  },
  {
    id: "transcript",
    name: "성적증명서",
    description: "교육과정의 성적 및 평가 결과를 확인할 수 있는 증명서입니다.",
    price: 3000,
    icon: BookOpen,
  },
  {
    id: "employment",
    name: "재직증명서",
    description: "대한인재 소속 재직 사실을 공식적으로 증명하는 문서입니다.",
    price: 2000,
    icon: FileText,
  },
  {
    id: "education",
    name: "교육이수증명서",
    description: "특정 교육 프로그램 이수 사실을 증명하는 공식 문서입니다.",
    price: 3000,
    icon: ScrollText,
  },
];

export default function CertificatePage() {
  return (
    <>
      <PageBanner
        title="증명서 발급"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "증명서 발급", href: "/certificate" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white">
            필요한 <span className="text-[#c9a84c]">증명서</span>를 선택하세요
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            대한인재에서 발급 가능한 각종 증명서를 온라인으로 간편하게 신청하실 수 있습니다.
            신청 후 결제가 완료되면 즉시 발급됩니다.
          </p>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => {
            const IconComponent = cert.icon;
            return (
              <div
                key={cert.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-[#c9a84c]/30 hover:bg-white/[0.07] transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#c9a84c]/20 transition-colors">
                  <IconComponent className="w-6 h-6 text-[#c9a84c]" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {cert.name}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {cert.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[#c9a84c] font-bold text-lg">
                    {cert.price.toLocaleString()}원
                  </span>
                  <Link
                    href={`/certificate/${cert.id}`}
                    className="px-5 py-2 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] text-sm font-semibold rounded-lg hover:from-[#d4b85c] hover:to-[#e8d48b] transition-all duration-300 shadow-lg shadow-[#c9a84c]/10"
                  >
                    신청하기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">안내사항</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
              증명서는 결제 완료 후 PDF 파일로 즉시 발급됩니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
              발급된 증명서는 마이페이지에서 다시 다운로드 받으실 수 있습니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#c9a84c] mt-0.5">&#8226;</span>
              증명서 관련 문의사항은 고객센터(02-1234-5678)로 연락 바랍니다.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
