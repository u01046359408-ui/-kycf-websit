import PageBanner from "@/components/layout/PageBanner";

export const metadata = {
  title: "지도사 공지사항 - 한국유소년체스연맹",
};

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  views: number;
  isImportant: boolean;
}

const notices: NoticeItem[] = [
  {
    id: 42,
    title: "[필독] 2026년 제1기 지도사 양성과정 접수 안내",
    date: "2026.03.10",
    views: 328,
    isImportant: true,
  },
  {
    id: 41,
    title: "[변경] 2026년 지도사 자격시험 일정 변경 공지",
    date: "2026.03.05",
    views: 256,
    isImportant: true,
  },
  {
    id: 40,
    title: "2025년 하반기 지도사 보수교육 수료증 발급 안내",
    date: "2026.02.20",
    views: 189,
    isImportant: false,
  },
  {
    id: 39,
    title: "지도사 자격증 갱신 절차 안내 (2026년도 적용)",
    date: "2026.02.10",
    views: 412,
    isImportant: false,
  },
  {
    id: 38,
    title: "2025년 제3기 지도사 양성과정 최종 합격자 발표",
    date: "2026.01.15",
    views: 567,
    isImportant: false,
  },
  {
    id: 37,
    title: "지도사 교육 교재 개정판(제5판) 안내",
    date: "2025.12.20",
    views: 234,
    isImportant: false,
  },
];

export default function InstructorNoticePage() {
  return (
    <>
      <PageBanner
        title="지도사 공지사항"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "교육/연수", href: "/education" },
          { label: "지도사 공지사항", href: "/education/instructor-notice" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              지도사 <span className="text-[#c9a84c]">공지사항</span>
            </h2>
            <p className="mt-2 text-gray-400">
              지도사 과정 관련 주요 공지사항을 확인하세요.
            </p>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="px-4 py-2 rounded-lg bg-[#1a2744] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors w-56"
            />
            <button className="px-4 py-2 rounded-lg bg-[#c9a84c] text-[#0a1628] font-semibold text-sm hover:bg-[#d4b85c] transition-colors">
              검색
            </button>
          </div>
        </div>

        {/* Notice Table */}
        <div className="rounded-xl border border-white/10 overflow-hidden bg-[#111d35]/80 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a2744]">
                  <th className="px-6 py-4 text-center text-[#c9a84c] font-semibold w-20">번호</th>
                  <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold">제목</th>
                  <th className="px-6 py-4 text-center text-[#c9a84c] font-semibold w-32">작성일</th>
                  <th className="px-6 py-4 text-center text-[#c9a84c] font-semibold w-24">조회수</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {notices.map((notice, index) => (
                  <tr
                    key={notice.id}
                    className={`hover:bg-[#c9a84c]/5 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-6 py-4 text-center">
                      {notice.isImportant ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-bold">
                          중요
                        </span>
                      ) : (
                        <span className="text-gray-400">{notice.id}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`hover:text-[#d4b85c] transition-colors ${
                          notice.isImportant ? "text-white font-semibold" : "text-gray-300"
                        }`}
                      >
                        {notice.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-center whitespace-nowrap">
                      {notice.date}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-center">
                      {notice.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <button className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors">
            &laquo;
          </button>
          <button className="w-9 h-9 rounded-lg bg-[#c9a84c] text-[#0a1628] font-semibold text-sm">
            1
          </button>
          <button className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors">
            2
          </button>
          <button className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors">
            3
          </button>
          <button className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors">
            4
          </button>
          <button className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors">
            &raquo;
          </button>
        </div>
      </div>
    </>
  );
}
