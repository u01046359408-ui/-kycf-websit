import PageBanner from "@/components/layout/PageBanner";

export const metadata = {
  title: "조직도 - 한국유소년체스연맹",
};

interface OrgNode {
  title: string;
  name?: string;
  children?: OrgNode[];
}

const orgData: OrgNode = {
  title: "이사장",
  name: "홍길동",
  children: [
    {
      title: "사무총장",
      name: "김대한",
      children: [
        {
          title: "경영지원본부",
          children: [
            { title: "총무팀" },
            { title: "재무팀" },
            { title: "인사팀" },
          ],
        },
        {
          title: "자격인증본부",
          children: [
            { title: "시험관리팀" },
            { title: "자격개발팀" },
            { title: "인증심사팀" },
          ],
        },
        {
          title: "교육연수본부",
          children: [
            { title: "교육기획팀" },
            { title: "콘텐츠개발팀" },
            { title: "현장교육팀" },
          ],
        },
        {
          title: "대외협력본부",
          children: [
            { title: "국제협력팀" },
            { title: "홍보팀" },
          ],
        },
      ],
    },
  ],
};

function OrgBox({ title, name, highlight }: { title: string; name?: string; highlight?: boolean }) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center px-6 py-3 rounded-xl border text-center min-w-[120px] ${
        highlight
          ? "bg-gradient-to-br from-[#c9a84c] to-[#d4b85c] border-[#c9a84c] text-[#0a1628]"
          : "bg-[#1a2744] border-white/10 text-white hover:border-[#c9a84c]/30 transition-colors duration-200"
      }`}
    >
      <span className={`text-sm font-semibold ${highlight ? "text-[#0a1628]" : "text-white"}`}>
        {title}
      </span>
      {name && (
        <span className={`text-xs mt-0.5 ${highlight ? "text-[#0a1628]/70" : "text-gray-400"}`}>
          {name}
        </span>
      )}
    </div>
  );
}

export default function OrganizationPage() {
  return (
    <>
      <PageBanner
        title="조직도"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "한국유소년체스연맹", href: "/about" },
          { label: "조직도", href: "/about/organization" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          한국유소년체스연맹는 효율적인 조직 운영을 통해 인재 양성과 자격 인증 사업을
          체계적으로 수행하고 있습니다.
        </p>

        <div className="flex flex-col items-center overflow-x-auto pb-8">
          {/* Level 1: 이사장 */}
          <OrgBox title={orgData.title} name={orgData.name} highlight />

          {/* Connector */}
          <div className="w-px h-8 bg-[#c9a84c]/40" />

          {/* Level 2: 사무총장 */}
          <OrgBox
            title={orgData.children![0].title}
            name={orgData.children![0].name}
            highlight
          />

          {/* Connector */}
          <div className="w-px h-8 bg-[#c9a84c]/40" />

          {/* Horizontal bar */}
          <div className="relative w-full max-w-4xl">
            <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-white/20" />

            {/* Level 3: 본부 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {orgData.children![0].children!.map((dept) => (
                <div key={dept.title} className="flex flex-col items-center">
                  {/* Vertical connector from horizontal bar */}
                  <div className="w-px h-4 bg-white/20 -mt-4 mb-4" />

                  <OrgBox title={dept.title} />

                  {/* Sub-departments */}
                  {dept.children && (
                    <>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="space-y-2">
                        {dept.children.map((sub) => (
                          <div
                            key={sub.title}
                            className="flex items-center justify-center"
                          >
                            <div className="px-4 py-2 rounded-lg border border-white/5 bg-[#111d35] text-center">
                              <span className="text-xs text-gray-300">
                                {sub.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
