import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";

export const metadata = {
  title: "사이트맵 - 한국유소년체스연맹",
};

const sitemapSections = [
  {
    title: "한국유소년체스연맹",
    links: [
      { label: "인사말", href: "/about/greeting" },
      { label: "설립목적", href: "/about/purpose" },
      { label: "연혁", href: "/about/history" },
      { label: "조직도", href: "/about/organization" },
      { label: "CI 소개", href: "/about/ci" },
      { label: "오시는 길", href: "/about/location" },
    ],
  },
  {
    title: "자격검정",
    links: [
      { label: "자격종목 안내", href: "/certification/subjects" },
      { label: "시험일정", href: "/certification/schedule" },
      { label: "접수안내", href: "/certification/apply" },
      { label: "합격자 발표", href: "/certification/results" },
      { label: "자격증 발급", href: "/certification/issuance" },
      { label: "자격증 진위확인", href: "/certification/verify" },
    ],
  },
  {
    title: "교육연수",
    links: [
      { label: "교육과정 안내", href: "/education/courses" },
      { label: "온라인 교육", href: "/education/online" },
      { label: "오프라인 교육", href: "/education/offline" },
      { label: "교육신청", href: "/education/apply" },
    ],
  },
  {
    title: "알림마당",
    links: [
      { label: "공지사항", href: "/notice/announcements" },
      { label: "사진자료실", href: "/notice/gallery" },
      { label: "후원 및 기부", href: "/notice/support" },
      { label: "구인/구직", href: "/notice/jobs" },
      { label: "E-Shop", href: "/notice/shop" },
    ],
  },
  {
    title: "기타",
    links: [
      { label: "개인정보처리방침", href: "/privacy" },
      { label: "이용약관", href: "/terms" },
      { label: "사이트맵", href: "/sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <PageBanner
        title="사이트맵"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "사이트맵", href: "/sitemap" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemapSections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl bg-[#111d35] border border-white/10 p-6 hover:border-[#c9a84c]/20 transition-colors"
            >
              <h2 className="text-lg font-bold text-[#c9a84c] mb-4 pb-3 border-b border-white/10">
                {section.title}
              </h2>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#c9a84c] transition-colors group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-[#c9a84c] transition-colors" />
                      {link.label}
                    </Link>
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
