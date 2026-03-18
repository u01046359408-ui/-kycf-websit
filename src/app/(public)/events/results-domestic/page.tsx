import PageBanner from "@/components/layout/PageBanner";

export const metadata = {
  title: "국내 결과 - 대한인재",
};

interface DomesticResult {
  id: number;
  competition: string;
  date: string;
  location: string;
  result: string;
  note: string;
}

const results: DomesticResult[] = [
  {
    id: 1,
    competition: "제18회 전국 인재개발 경진대회 (춘계)",
    date: "2026.03.08",
    location: "광주 김대중컨벤션센터",
    result: "참가 48팀 / 수상 12팀",
    note: "최우수상: 서울특별시 대표팀",
  },
  {
    id: 2,
    competition: "2025 하반기 직업능력개발 경시대회",
    date: "2025.11.02",
    location: "대구 엑스코(EXCO)",
    result: "참가 62팀 / 수상 18팀",
    note: "대상: 경기도 대표팀",
  },
  {
    id: 3,
    competition: "제17회 전국 인재개발 경진대회 (추계)",
    date: "2025.09.14",
    location: "서울 올림픽공원 체조경기장",
    result: "참가 55팀 / 수상 15팀",
    note: "최우수상: 부산광역시 대표팀",
  },
  {
    id: 4,
    competition: "2025 전국 청소년 인재 올림피아드",
    date: "2025.07.20",
    location: "인천 송도컨벤시아",
    result: "참가 120명 / 수상 30명",
    note: "대상: 김민준 (서울 한영고)",
  },
  {
    id: 5,
    competition: "제6회 전국 지도사 기술경연대회",
    date: "2025.05.18",
    location: "대전 컨벤션센터",
    result: "참가 38명 / 수상 10명",
    note: "최우수상: 박성호 (경기지부)",
  },
  {
    id: 6,
    competition: "2025 상반기 직업능력개발 경시대회",
    date: "2025.04.12",
    location: "부산 벡스코 제2전시장",
    result: "참가 58팀 / 수상 16팀",
    note: "대상: 충남 대표팀",
  },
];

export default function ResultsDomesticPage() {
  return (
    <>
      <PageBanner
        title="국내 결과"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "행사/인재", href: "/events" },
          { label: "국내 결과", href: "/events/results-domestic" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">
            국내 대회 <span className="text-[#c9a84c]">결과</span>
          </h2>
          <p className="mt-2 text-gray-400">
            전국 각지에서 개최된 인재개발 관련 대회의 결과를 확인하세요.
          </p>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 overflow-hidden bg-[#111d35]/80 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a2744]">
                  <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">
                    번호
                  </th>
                  <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">
                    대회명
                  </th>
                  <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">
                    날짜
                  </th>
                  <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">
                    장소
                  </th>
                  <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">
                    결과
                  </th>
                  <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#c9a84c]/5 transition-colors ${
                      index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-400 text-center">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {item.competition}
                    </td>
                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {item.result}
                    </td>
                    <td className="px-6 py-4 text-[#d4b85c] font-medium">
                      {item.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination placeholder */}
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
