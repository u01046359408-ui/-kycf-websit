import PageBanner from "@/components/layout/PageBanner";

export const metadata = {
  title: "지도사 과정안내 - 대한인재",
};

const curriculum = [
  { subject: "인재개발론", hours: "12시간", description: "인재개발의 이론적 기초와 역사적 발전과정" },
  { subject: "교수학습방법론", hours: "16시간", description: "효과적인 교수법 및 학습 촉진 기법" },
  { subject: "직업능력개발 실무", hours: "20시간", description: "현장 맞춤형 직업능력개발 실습" },
  { subject: "평가 및 자격인증", hours: "12시간", description: "역량 평가 체계 및 자격인증 절차" },
  { subject: "리더십과 소통", hours: "8시간", description: "팀 리더십, 코칭, 커뮤니케이션 스킬" },
  { subject: "현장실습", hours: "24시간", description: "실무 현장에서의 지도 실습 및 피드백" },
  { subject: "종합평가", hours: "8시간", description: "필기시험 및 실기시험" },
];

const schedule = [
  { round: "제1기", period: "2026.04.07 ~ 2026.05.16", status: "접수중", seats: "30명" },
  { round: "제2기", period: "2026.07.06 ~ 2026.08.14", status: "예정", seats: "30명" },
  { round: "제3기", period: "2026.10.05 ~ 2026.11.13", status: "예정", seats: "30명" },
];

export default function InstructorCoursePage() {
  return (
    <>
      <PageBanner
        title="지도사 과정안내"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "교육/연수", href: "/education" },
          { label: "지도사 과정안내", href: "/education/instructor" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            지도사 <span className="text-[#c9a84c]">양성과정</span>
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-3xl">
            대한인재개발원 지도사 양성과정은 인재개발 분야의 전문 지도 인력을 양성하기 위한
            체계적인 교육 프로그램입니다. 총 100시간의 이론 및 실습 교육을 통해 현장에서
            즉시 활동할 수 있는 역량을 갖춘 지도사를 배출합니다.
          </p>
        </div>

        {/* Requirements */}
        <div className="mb-12 rounded-xl border border-white/10 bg-[#111d35]/80 backdrop-blur-sm p-8">
          <h3 className="text-xl font-bold text-white mb-6">지원 자격요건</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0" />
                <p className="text-gray-300 text-sm">만 18세 이상의 대한민국 국민</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0" />
                <p className="text-gray-300 text-sm">고등학교 졸업 이상의 학력 소지자</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0" />
                <p className="text-gray-300 text-sm">관련 분야 1년 이상 실무 경력자 우대</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0" />
                <p className="text-gray-300 text-sm">신체 건강하며 교육 전 과정 참여 가능자</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0" />
                <p className="text-gray-300 text-sm">본 원 회원 가입자 (비회원 시 동시 접수 가능)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0" />
                <p className="text-gray-300 text-sm">결격사유가 없는 자</p>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Table */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">교육과정 (총 100시간)</h3>
          <div className="rounded-xl border border-white/10 overflow-hidden bg-[#111d35]/80 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1a2744]">
                    <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold">과목명</th>
                    <th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">시간</th>
                    <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold">내용</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {curriculum.map((item, index) => (
                    <tr
                      key={item.subject}
                      className={`hover:bg-[#c9a84c]/5 transition-colors ${
                        index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                      }`}
                    >
                      <td className="px-6 py-4 text-white font-medium">{item.subject}</td>
                      <td className="px-6 py-4 text-[#d4b85c] font-semibold text-center">{item.hours}</td>
                      <td className="px-6 py-4 text-gray-300">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">2026년 교육일정</h3>
          <div className="rounded-xl border border-white/10 overflow-hidden bg-[#111d35]/80 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1a2744]">
                    <th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">기수</th>
                    <th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">교육기간</th>
                    <th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">모집인원</th>
                    <th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">접수상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {schedule.map((item, index) => (
                    <tr
                      key={item.round}
                      className={`hover:bg-[#c9a84c]/5 transition-colors ${
                        index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                      }`}
                    >
                      <td className="px-6 py-4 text-white font-medium text-center">{item.round}</td>
                      <td className="px-6 py-4 text-gray-300 text-center">{item.period}</td>
                      <td className="px-6 py-4 text-gray-300 text-center">{item.seats}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            item.status === "접수중"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fee Info */}
        <div className="mb-12 rounded-xl border border-white/10 bg-[#111d35]/80 backdrop-blur-sm p-8">
          <h3 className="text-xl font-bold text-white mb-6">교육비 안내</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-[#1a2744] border border-white/5">
              <p className="text-gray-400 text-sm mb-2">교육비</p>
              <p className="text-2xl font-bold text-white">550,000<span className="text-sm font-normal text-gray-400 ml-1">원</span></p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#1a2744] border border-white/5">
              <p className="text-gray-400 text-sm mb-2">교재비</p>
              <p className="text-2xl font-bold text-white">50,000<span className="text-sm font-normal text-gray-400 ml-1">원</span></p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#1a2744] border border-white/5">
              <p className="text-gray-400 text-sm mb-2">자격시험 응시료</p>
              <p className="text-2xl font-bold text-white">100,000<span className="text-sm font-normal text-gray-400 ml-1">원</span></p>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            * 교육비는 입금 후 교육 시작 7일 전까지 전액 환불 가능합니다. 교육 시작 후에는 환불이 불가합니다.
          </p>
        </div>

        {/* Apply Button */}
        <div className="text-center">
          <button className="px-10 py-4 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-[#c9a84c]/25 transition-all duration-300 transform hover:-translate-y-0.5">
            지도사 과정 신청하기
          </button>
          <p className="mt-3 text-sm text-gray-500">
            문의전화: 02-1234-5678 (평일 09:00~18:00)
          </p>
        </div>
      </div>
    </>
  );
}
