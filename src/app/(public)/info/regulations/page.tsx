"use client";

import PageBanner from "@/components/layout/PageBanner";
import PageEditableWrapper from "@/components/ui/PageEditableWrapper";
import { BookOpen, ChevronRight } from "lucide-react";

const tableOfContents = [
  { id: "general", chapter: "제1장", title: "총칙", articles: "제1조 ~ 제5조" },
  { id: "eligibility", chapter: "제2장", title: "참가 자격", articles: "제6조 ~ 제10조" },
  { id: "procedure", chapter: "제3장", title: "경기 진행", articles: "제11조 ~ 제20조" },
  { id: "evaluation", chapter: "제4장", title: "심사 및 채점", articles: "제21조 ~ 제28조" },
  { id: "violations", chapter: "제5장", title: "위반 및 제재", articles: "제29조 ~ 제35조" },
  { id: "appeals", chapter: "제6장", title: "이의신청", articles: "제36조 ~ 제40조" },
  { id: "supplementary", chapter: "제7장", title: "보칙", articles: "제41조 ~ 제45조" },
];

const regulations = [
  { id: "general", chapter: "제1장 총칙", rules: [
    { article: "제1조 (목적)", content: "본 규정은 한국유소년체스연맹가 주최 및 주관하는 각종 대회의 공정한 운영과 참가자의 권익 보호를 목적으로 한다." },
    { article: "제2조 (적용 범위)", content: "본 규정은 한국유소년체스연맹가 주최, 주관 또는 승인하는 모든 대회에 적용된다. 다만, 개별 대회의 특수성을 고려하여 세부 규정을 별도로 정할 수 있다." },
    { article: "제3조 (용어의 정의)", content: '본 규정에서 사용하는 용어의 정의는 다음과 같다.\n1. "대회"란 한국유소년체스연맹가 공인하는 인재 경진 활동을 말한다.\n2. "참가자"란 대회에 출전하는 인증 보유자를 말한다.\n3. "심사위원"이란 한국유소년체스연맹가 위촉한 평가 전문가를 말한다.\n4. "운영위원회"란 대회의 운영 전반을 관장하는 기구를 말한다.' },
    { article: "제4조 (대회의 종류)", content: "한국유소년체스연맹가 개최하는 대회는 다음과 같이 분류한다.\n1. 전국 인재 경진대회\n2. 지역별 예선 대회\n3. 분야별 전문 대회\n4. 신인 발굴 대회\n5. 기타 한국유소년체스연맹가 승인하는 대회" },
    { article: "제5조 (운영위원회)", content: "대회의 원활한 운영을 위해 운영위원회를 구성하며, 위원장 1명, 부위원장 2명, 위원 5명 이상으로 구성한다. 운영위원회는 대회 계획 수립, 심사위원 위촉, 결과 확정 등의 권한을 가진다." },
  ]},
  { id: "eligibility", chapter: "제2장 참가 자격", rules: [
    { article: "제6조 (기본 자격)", content: "대회에 참가하고자 하는 자는 다음 각 호의 요건을 모두 갖추어야 한다.\n1. 한국유소년체스연맹 인증서 보유자로서 유효기간 내에 있을 것\n2. 대회 참가 신청 기한 내에 정해진 절차에 따라 신청을 완료할 것\n3. 소정의 참가비를 납부할 것\n4. 과거 2년 이내에 부정행위로 인한 자격 정지 처분을 받지 않은 자일 것" },
    { article: "제7조 (등급별 참가 제한)", content: "각 대회별 참가 가능 등급은 다음과 같다.\n1. 전국 대회: 지역 예선 통과자 또는 고급 이상 인증 보유자\n2. 지역 대회: 해당 지역 소속 인증 보유자 전원\n3. 전문 대회: 해당 분야 중급 이상 인증 보유자\n4. 신인 대회: 인증 취득 후 1년 이내 초급 인증 보유자" },
    { article: "제8조 (참가 제한 사유)", content: "다음 각 호에 해당하는 자는 대회 참가가 제한된다.\n1. 인증서 유효기간이 만료된 자\n2. 징계 처분 기간 중인 자\n3. 참가비를 미납한 자\n4. 허위 서류를 제출한 사실이 확인된 자" },
  ]},
  { id: "procedure", chapter: "제3장 경기 진행", rules: [
    { article: "제11조 (경기 일정)", content: "대회 일정은 개최 60일 전까지 공고하여야 하며, 부득이한 사정으로 일정이 변경되는 경우 최소 14일 전에 참가자에게 통보하여야 한다." },
    { article: "제12조 (경기 방식)", content: "경기는 다음의 방식으로 진행한다.\n1. 예선: 서류 심사 및 온라인 필기 평가\n2. 본선: 실기 평가 및 면접 심사\n3. 결선: 최종 종합 평가 (해당 대회에 한함)" },
    { article: "제13조 (경기 시간)", content: "각 평가 단계별 제한 시간은 다음과 같다.\n1. 필기 평가: 120분\n2. 실기 평가: 180분\n3. 면접 심사: 1인당 20분 이내\n단, 대회의 특성에 따라 운영위원회의 결정으로 조정할 수 있다." },
    { article: "제14조 (지각 및 결시)", content: "정해진 시간에 입장하지 못한 참가자는 다음과 같이 처리한다.\n1. 10분 이내 지각: 경기 참가 허용, 추가 시간 부여 없음\n2. 10분 초과 지각: 해당 평가 응시 불가\n3. 결시: 해당 평가 0점 처리" },
    { article: "제15조 (준비물)", content: "참가자는 다음 물품을 지참하여야 한다.\n1. 신분증 (주민등록증, 운전면허증, 여권 중 택1)\n2. 인증서 원본 또는 사본\n3. 대회 참가 확인서\n4. 대회별 지정 준비물 (별도 공지)" },
  ]},
  { id: "evaluation", chapter: "제4장 심사 및 채점", rules: [
    { article: "제21조 (심사위원 구성)", content: "심사위원은 해당 분야 전문가 5인 이상으로 구성하며, 심사위원장은 운영위원회에서 선임한다. 심사위원은 참가자와 이해 관계가 없어야 한다." },
    { article: "제22조 (채점 기준)", content: "채점은 다음 기준에 따라 100점 만점으로 실시한다.\n1. 전문 지식 (30점): 분야별 이론적 지식 수준\n2. 실무 능력 (35점): 과제 수행 능력 및 완성도\n3. 창의성 (20점): 독창적 문제 해결 접근법\n4. 의사소통 (15점): 발표력 및 논리적 표현력" },
    { article: "제23조 (채점 절차)", content: "채점은 블라인드 방식으로 진행하며, 최고점과 최저점을 제외한 나머지 점수의 평균으로 최종 점수를 산출한다. 채점 결과는 심사위원 전원의 서명을 받아 확정한다." },
  ]},
  { id: "violations", chapter: "제5장 위반 및 제재", rules: [
    { article: "제29조 (부정행위의 범위)", content: "다음 각 호에 해당하는 행위를 부정행위로 본다.\n1. 타인의 답안 또는 과제물을 모사하는 행위\n2. 허용되지 않은 전자기기 또는 참고자료를 사용하는 행위\n3. 타인에게 답안을 알려주거나 대리 응시하는 행위\n4. 심사위원 또는 운영 요원에게 부당한 청탁을 하는 행위\n5. 경기 진행을 방해하는 일체의 행위" },
    { article: "제30조 (제재 조치)", content: "부정행위가 확인된 경우 다음의 제재를 부과한다.\n1. 경고: 경미한 규정 위반 시\n2. 해당 평가 실격: 명백한 부정행위 시\n3. 대회 전체 실격: 중대한 부정행위 시\n4. 자격 정지 (1~2년): 악의적 부정행위 시\n5. 인증 취소: 반복적 또는 극히 중대한 부정행위 시" },
  ]},
  { id: "appeals", chapter: "제6장 이의신청", rules: [
    { article: "제36조 (이의신청 절차)", content: "경기 결과에 이의가 있는 참가자는 결과 발표 후 14일 이내에 서면으로 이의신청을 할 수 있다. 이의신청서에는 이의 사유, 관련 증빙자료를 첨부하여야 한다." },
    { article: "제37조 (이의심사위원회)", content: "이의신청이 접수되면 이의심사위원회를 구성하여 30일 이내에 심사 결과를 통보한다. 이의심사위원회는 기존 심사위원이 아닌 별도의 전문가 3인 이상으로 구성한다." },
  ]},
];

export default function RegulationsPage() {
  return (
    <>
      <PageBanner title="경기규정" breadcrumb={[{ label: "HOME", href: "/" }, { label: "종목정보", href: "/info" }, { label: "경기규정", href: "/info/regulations" }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageEditableWrapper pageKey="regulations">
          {/* Intro */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 sm:p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-[#c9a84c]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">한국유소년체스연맹 대회 경기규정</h2>
                <div className="text-sm text-gray-400 leading-relaxed space-y-3">
                  <p>본 규정은 한국유소년체스연맹가 주최 및 주관하는 모든 대회의 공정한 운영을 위해 제정되었습니다. 모든 참가자와 관계자는 본 규정을 숙지하고 준수해야 합니다. 본 규정은 2024년 1월 1일부터 시행됩니다.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 sticky top-24">
                <h3 className="text-sm font-semibold text-[#c9a84c] uppercase tracking-wider mb-4">목차</h3>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group">
                      <ChevronRight className="w-3 h-3 text-[#c9a84c]/50 group-hover:text-[#c9a84c] transition-colors duration-200" />
                      <span className="text-[#c9a84c]/70 text-xs font-mono shrink-0">{item.chapter}</span>
                      <span>{item.title}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="lg:col-span-3 space-y-8">
              {regulations.map((section) => (
                <section key={section.id} id={section.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 bg-[#c9a84c]/10 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white">{section.chapter}</h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    {section.rules.map((rule) => (
                      <div key={rule.article} className="px-6 py-5">
                        <h4 className="text-sm font-semibold text-[#d4b85c] mb-2">{rule.article}</h4>
                        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{rule.content}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-2xl p-5">
                <p className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-[#c9a84c] font-semibold">부칙:</span> 본 규정은 2024년 1월 1일부터 시행한다. 본 규정 시행 이전에 개최된 대회에 대해서는 종전의 규정을 적용한다. 본 규정에 명시되지 않은 사항은 운영위원회의 결정에 따른다.
                </p>
              </div>
            </div>
          </div>
        </PageEditableWrapper>
      </div>
    </>
  );
}
