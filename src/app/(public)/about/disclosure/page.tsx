import PageBanner from "@/components/layout/PageBanner";
import { FileText, Download } from "lucide-react";

export const metadata = {
  title: "경영공시 - 대한인재",
};

const disclosures = [
  {
    id: 1,
    year: "2024",
    title: "2023 회계연도 결산 보고서",
    date: "2024-03-20",
    category: "재무",
  },
  {
    id: 2,
    year: "2024",
    title: "2024년도 사업계획서",
    date: "2024-01-15",
    category: "사업",
  },
  {
    id: 3,
    year: "2023",
    title: "2022 회계연도 결산 보고서",
    date: "2023-03-18",
    category: "재무",
  },
  {
    id: 4,
    year: "2023",
    title: "2023년도 사업계획서",
    date: "2023-01-20",
    category: "사업",
  },
  {
    id: 5,
    year: "2023",
    title: "임원 보수 현황 공시",
    date: "2023-04-15",
    category: "인사",
  },
  {
    id: 6,
    year: "2022",
    title: "2021 회계연도 결산 보고서",
    date: "2022-03-22",
    category: "재무",
  },
  {
    id: 7,
    year: "2022",
    title: "2022년도 사업계획서",
    date: "2022-01-18",
    category: "사업",
  },
  {
    id: 8,
    year: "2021",
    title: "2020 회계연도 결산 보고서",
    date: "2021-03-25",
    category: "재무",
  },
  {
    id: 9,
    year: "2021",
    title: "2021년도 사업계획서",
    date: "2021-01-22",
    category: "사업",
  },
];

function categoryBadge(category: string) {
  switch (category) {
    case "재무":
      return "text-blue-400 bg-blue-400/10";
    case "사업":
      return "text-emerald-400 bg-emerald-400/10";
    case "인사":
      return "text-purple-400 bg-purple-400/10";
    default:
      return "text-gray-400 bg-gray-400/10";
  }
}

export default function DisclosurePage() {
  return (
    <>
      <PageBanner
        title="경영공시"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "대한인재", href: "/about" },
          { label: "경영공시", href: "/about/disclosure" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-gray-400 mb-8">
          비영리법인 경영 투명성 제고를 위한 경영공시 자료입니다.
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1a2744] border-b border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider w-12">
                  번호
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider w-20">
                  연도
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider hidden sm:table-cell w-20">
                  구분
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider hidden md:table-cell">
                  공시일
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider text-center">
                  다운로드
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {disclosures.map((item) => (
                <tr
                  key={item.id}
                  className="bg-[#111d35]/60 hover:bg-[#1a2744]/60 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {item.year}
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoryBadge(item.category)}`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="text-sm text-gray-300">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#c9a84c] bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 transition-colors duration-200">
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
