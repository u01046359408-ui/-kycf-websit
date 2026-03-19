import PageBanner from "@/components/layout/PageBanner";
import { FileText, Download } from "lucide-react";

export const metadata = {
  title: "규정 - 한국유소년체스연맹",
};

const regulations = [
  {
    id: 1,
    name: "정관",
    date: "2024-03-15",
    version: "제5차 개정",
  },
  {
    id: 2,
    name: "자격검정 시행규정",
    date: "2024-01-10",
    version: "제3차 개정",
  },
  {
    id: 3,
    name: "교육연수 운영규정",
    date: "2023-09-20",
    version: "제2차 개정",
  },
  {
    id: 4,
    name: "개인정보 처리방침",
    date: "2024-06-01",
    version: "제4차 개정",
  },
  {
    id: 5,
    name: "윤리강령",
    date: "2022-05-15",
    version: "제정",
  },
  {
    id: 6,
    name: "인사규정",
    date: "2023-03-01",
    version: "제2차 개정",
  },
  {
    id: 7,
    name: "회계규정",
    date: "2023-03-01",
    version: "제1차 개정",
  },
  {
    id: 8,
    name: "이사회 운영규정",
    date: "2020-01-15",
    version: "제정",
  },
];

export default function RegulationsPage() {
  return (
    <>
      <PageBanner
        title="규정"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "한국유소년체스연맹", href: "/about" },
          { label: "규정", href: "/about/regulations" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-gray-400 mb-8">
          한국유소년체스연맹의 주요 규정을 열람하실 수 있습니다.
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1a2744] border-b border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider w-12">
                  번호
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider">
                  규정명
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider hidden sm:table-cell">
                  비고
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider hidden md:table-cell">
                  시행일
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-[#c9a84c] uppercase tracking-wider text-center">
                  다운로드
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {regulations.map((reg) => (
                <tr
                  key={reg.id}
                  className="bg-[#111d35]/60 hover:bg-[#1a2744]/60 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {reg.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="text-sm text-white font-medium">
                        {reg.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden sm:table-cell">
                    {reg.version}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">
                    {reg.date}
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
