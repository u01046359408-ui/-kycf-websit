import PageBanner from "@/components/layout/PageBanner";

export const metadata = {
  title: "대회기록 - 대한인재",
};

interface CompetitionRecord {
  id: number;
  year: string;
  competition: string;
  category: string;
  winner: string;
  affiliation: string;
  award: string;
}

const records: CompetitionRecord[] = [
  {
    id: 1,
    year: "2026",
    competition: "제18회 전국 인재개발 경진대회",
    category: "직업능력개발",
    winner: "이정우",
    affiliation: "서울특별시 대표",
    award: "대상 (국무총리상)",
  },
  {
    id: 2,
    year: "2025",
    competition: "제17회 전국 인재개발 경진대회",
    category: "직업능력개발",
    winner: "김하늘",
    affiliation: "부산광역시 대표",
    award: "대상 (국무총리상)",
  },
  {
    id: 3,
    year: "2025",
    competition: "2025 아시아 인재개발 챔피언십",
    category: "기술혁신",
    winner: "박지민",
    affiliation: "경기도 대표",
    award: "금메달",
  },
  {
    id: 4,
    year: "2024",
    competition: "제16회 전국 인재개발 경진대회",
    category: "직업능력개발",
    winner: "최서윤",
    affiliation: "대전광역시 대표",
    award: "대상 (국무총리상)",
  },
  {
    id: 5,
    year: "2024",
    competition: "2024 세계 인재개발 포럼 경진부문",
    category: "국제교류",
    winner: "정민호",
    affiliation: "충남 대표",
    award: "금메달",
  },
  {
    id: 6,
    year: "2023",
    competition: "제15회 전국 인재개발 경진대회",
    category: "직업능력개발",
    winner: "한소희",
    affiliation: "인천광역시 대표",
    award: "대상 (국무총리상)",
  },
  {
    id: 7,
    year: "2023",
    competition: "제6회 한중일 인재교류 대회",
    category: "국제교류",
    winner: "오현수",
    affiliation: "서울특별시 대표",
    award: "종합 우승",
  },
  {
    id: 8,
    year: "2022",
    competition: "제14회 전국 인재개발 경진대회",
    category: "직업능력개발",
    winner: "윤태양",
    affiliation: "경기도 대표",
    award: "대상 (국무총리상)",
  },
];

export default function RecordsPage() {
  const years = [...new Set(records.map((r) => r.year))];

  return (
    <>
      <PageBanner
        title="대회기록"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "행사/인재", href: "/events" },
          { label: "대회기록", href: "/events/records" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">
            역대 대회 <span className="text-[#c9a84c]">기록</span>
          </h2>
          <p className="mt-2 text-gray-400">
            대한인재개발원 주최/참가 대회의 주요 수상 기록을 아카이브합니다.
          </p>
        </div>

        {/* Year filter buttons */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-lg bg-[#c9a84c] text-[#0a1628] font-semibold text-sm">
            전체
          </button>
          {years.map((year) => (
            <button
              key={year}
              className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors"
            >
              {year}
            </button>
          ))}
        </div>

        {/* Record Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <div
              key={record.id}
              className="group rounded-xl border border-white/10 bg-[#111d35]/80 backdrop-blur-sm p-6 hover:border-[#c9a84c]/30 transition-all duration-300"
            >
              {/* Year & Category Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-[#c9a84c]">
                  {record.year}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-gray-400">
                  {record.category}
                </span>
              </div>

              {/* Competition Name */}
              <h3 className="text-white font-semibold leading-snug mb-4 group-hover:text-[#d4b85c] transition-colors">
                {record.competition}
              </h3>

              {/* Divider */}
              <div className="w-full h-px bg-white/10 mb-4" />

              {/* Winner Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">수상자</span>
                  <span className="text-white font-medium text-sm">
                    {record.winner}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">소속</span>
                  <span className="text-gray-300 text-sm">
                    {record.affiliation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">수상</span>
                  <span className="text-[#d4b85c] font-semibold text-sm">
                    {record.award}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
