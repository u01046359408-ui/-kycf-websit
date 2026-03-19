import PageBanner from "@/components/layout/PageBanner";

export const metadata = {
  title: "심판 공지사항 - 한국유소년체스연맹",
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
    id: 35,
    title: "[필독] 2026년 심판 양성과정(3급) 제1기 접수 안내",
    date: "2026.03.12",
    views: 287,
    isImportant: true,
  },
  {
    id: 34,
    title: "[안내] 2026년 심판 자격 갱신 대상자 명단 공지",
    date: "2026.03.01",
    views: 412,
    isImportant: true,
  },
  {
    id: 33,
    title: "제18회 전국 인재개발 경진대회 심판 모집 안내",
    date: "2026.02.25",
    views: 198,
    isImportant: false,
  },
  {
    id: 32,
    title: "2025년 하반기 심판 보수교육 수료자 명단",
    date: "2026.02.10",
    views: 156,
    isImportant: false,
  },
  {
    id: 31,
    title: "심판 복장 규정 변경 안내 (2026년 시행)",
    date: "2026.01.20",
    views: 345,
    isImportant: false,
  },
  {
    id: 30,
    title: "2025년 1급 심판 승급 시험 최종 합격자 발표",
    date: "2025.12.28",
    views: 523,
    isImportant: false,
  },
];

export default function RefereeNoticePage() {
  return (
    <>
      <PageBanner
        title="심판 공지사항"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "교육/연수", href: "/education" },
          { label: "심판 공지사항", href: "/education/referee-notice" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              심판 <span className="text-[#c9a84c]">공지사항</span>
            </h2>
            <p className="mt-2 text-gray-400">
              심판 과정 및 자격 관련 주요 공지사항을 확인하세요.
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
            &raquo;
          </button>
        </div>
      </div>
    </>
  );
}
