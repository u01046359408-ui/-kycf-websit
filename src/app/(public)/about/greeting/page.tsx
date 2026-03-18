import PageBanner from "@/components/layout/PageBanner";

export const metadata = {
  title: "인사말 - 대한인재",
};

export default function GreetingPage() {
  return (
    <>
      <PageBanner
        title="인사말"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "대한인재", href: "/about" },
          { label: "인사말", href: "/about/greeting" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Photo area */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="w-64 h-80 rounded-2xl bg-[#1a2744] border border-white/10 flex items-center justify-center">
              <span className="text-gray-500 text-sm">대표 사진</span>
            </div>
            <div className="mt-6 text-center">
              <p className="text-xl font-bold text-white">홍 길 동</p>
              <p className="mt-1 text-sm text-[#c9a84c]">
                (사)대한인재개발원 이사장
              </p>
            </div>
          </div>

          {/* Greeting content */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white leading-relaxed">
              <span className="text-[#c9a84c]">대한인재</span>를 방문해 주신
              <br />
              여러분을 진심으로 환영합니다.
            </h2>

            <div className="w-16 h-0.5 bg-[#c9a84c] rounded-full" />

            <p className="text-gray-300 leading-relaxed">
              안녕하십니까. (사)대한인재개발원 이사장 홍길동입니다.
              바쁘신 와중에도 저희 대한인재 홈페이지를 방문해 주신 여러분께
              깊은 감사의 말씀을 드립니다. 대한인재는 &ldquo;사람이 곧
              국가의 미래&rdquo;라는 신념 아래, 대한민국의 인재 육성과
              자격 인증 사업에 매진해 왔습니다.
            </p>

            <p className="text-gray-300 leading-relaxed">
              우리 사회는 4차 산업혁명과 디지털 전환이라는 거대한 변화의
              흐름 속에 있습니다. 이러한 시대적 전환기에 가장 중요한 것은
              바로 &lsquo;사람&rsquo;입니다. 대한인재는 시대가 요구하는
              전문 인력 양성을 위해 체계적인 교육 프로그램을 개발하고,
              공정하고 신뢰할 수 있는 자격 인증 제도를 운영하고 있습니다.
              이를 통해 개인의 역량 강화는 물론, 국가 경쟁력 향상에
              기여하고자 합니다.
            </p>

            <p className="text-gray-300 leading-relaxed">
              또한, 지역사회와의 협력을 통해 소외 계층의 직업 교육과
              취업 지원에도 힘쓰고 있으며, 산업체와의 긴밀한 파트너십을
              바탕으로 현장 맞춤형 인재를 양성하는 데 주력하고 있습니다.
              대한인재는 앞으로도 변함없이 대한민국의 인재 양성을 위해
              최선을 다할 것을 약속드립니다.
            </p>

            <p className="text-gray-300 leading-relaxed">
              여러분의 관심과 성원이 저희에게 큰 힘이 됩니다.
              언제든지 의견을 주시면 귀담아 듣고 더 나은 서비스를 제공하기
              위해 노력하겠습니다. 감사합니다.
            </p>

            <div className="pt-4 text-right">
              <p className="text-gray-400 text-sm">
                (사)대한인재개발원 이사장
              </p>
              <p className="text-white text-lg font-semibold mt-1">
                홍 길 동
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
