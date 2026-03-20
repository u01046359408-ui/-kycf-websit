"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import {
  Pencil, Save, X,
  Award, Calendar, CheckSquare, Crown, Medal, Trophy, Users, Zap,
} from "lucide-react";

const competitionTypes = [
  { icon: Trophy, title: "전국 인재 경진대회", frequency: "연 1회 (매년 10월)", description: "전국 규모의 최대 인재 경진대회로, 각 지역 예선을 통과한 참가자들이 본선에서 경합합니다. 분야별 최고의 인재를 선발합니다.", participants: "전국 예선 통과자", level: "전국 대회" },
  { icon: Users, title: "지역별 예선 대회", frequency: "연 2회 (4월, 8월)", description: "전국 17개 시도별로 개최되는 예선 대회입니다. 지역 인재를 발굴하고 전국대회 출전 자격을 부여합니다.", participants: "해당 지역 인증 보유자", level: "지역 대회" },
  { icon: Zap, title: "분야별 전문 대회", frequency: "분기별 1회", description: "특정 전문 분야에 특화된 대회로, 해당 분야의 심화 역량을 평가합니다. IT, 경영, 기술, 예술 등 다양한 분야에서 개최됩니다.", participants: "중급 이상 인증 보유자", level: "전문 대회" },
  { icon: Crown, title: "신인 발굴 대회", frequency: "연 1회 (6월)", description: "새롭게 인증을 취득한 초급 인재를 대상으로 하는 대회입니다. 신규 인재의 성장을 지원하고 동기를 부여합니다.", participants: "인증 취득 1년 이내 초급자", level: "입문 대회" },
];

const requirements = [
  { title: "기본 참가 요건", items: ["한국유소년체스연맹 인증서 보유자 (유효기간 내)", "대회 참가 신청서 제출 완료", "참가비 납부 완료 (대회별 상이)", "만 15세 이상 대한민국 국적자"] },
  { title: "등급별 추가 요건", items: ["전국 대회: 지역 예선 통과 또는 고급 이상 인증 보유", "전문 대회: 해당 분야 중급 이상 인증 보유", "신인 대회: 인증 취득 후 1년 이내, 초급 등급", "지역 대회: 해당 지역 거주 또는 소속 기관 위치 확인"] },
  { title: "제출 서류", items: ["대회 참가 신청서 1부", "인증서 사본 1부 (또는 온라인 인증 확인)", "신분증 사본 1부", "재직증명서 또는 재학증명서 1부 (해당 시)"] },
];

const awards = [
  { rank: "대상", icon: Crown, prize: "상금 500만원 + 트로피", benefits: "전문가 등급 자동 승급, 해외 연수 기회 제공, 언론 보도", color: "from-[#c9a84c] to-[#e8d48b]" },
  { rank: "금상", icon: Trophy, prize: "상금 300만원 + 트로피", benefits: "1등급 승급 우대, 전문 교육 과정 무료 수강권", color: "from-[#c9a84c]/80 to-[#d4b85c]/80" },
  { rank: "은상", icon: Medal, prize: "상금 200만원 + 메달", benefits: "교육 과정 50% 할인, 멘토링 프로그램 참여 자격", color: "from-gray-300 to-gray-400" },
  { rank: "동상", icon: Award, prize: "상금 100만원 + 메달", benefits: "교육 과정 30% 할인, 우수 인재 네트워크 가입", color: "from-amber-600 to-amber-700" },
  { rank: "장려상", icon: CheckSquare, prize: "상금 50만원 + 상장", benefits: "교육 과정 20% 할인", color: "from-[#c9a84c]/40 to-[#d4b85c]/40" },
];

export default function CompetitionPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fallbackContent = `대회 종류

한국유소년체스연맹는 다양한 규모와 분야의 대회를 개최하여 인재들의 역량을 검증하고 성장을 지원합니다.

전국 인재 경진대회 (전국 대회) - 연 1회 (매년 10월)
전국 규모의 최대 인재 경진대회로, 각 지역 예선을 통과한 참가자들이 본선에서 경합합니다. 분야별 최고의 인재를 선발합니다.
참가 대상: 전국 예선 통과자

지역별 예선 대회 (지역 대회) - 연 2회 (4월, 8월)
전국 17개 시도별로 개최되는 예선 대회입니다. 지역 인재를 발굴하고 전국대회 출전 자격을 부여합니다.
참가 대상: 해당 지역 인증 보유자

분야별 전문 대회 (전문 대회) - 분기별 1회
특정 전문 분야에 특화된 대회로, 해당 분야의 심화 역량을 평가합니다. IT, 경영, 기술, 예술 등 다양한 분야에서 개최됩니다.
참가 대상: 중급 이상 인증 보유자

신인 발굴 대회 (입문 대회) - 연 1회 (6월)
새롭게 인증을 취득한 초급 인재를 대상으로 하는 대회입니다. 신규 인재의 성장을 지원하고 동기를 부여합니다.
참가 대상: 인증 취득 1년 이내 초급자

참가 요건

기본 참가 요건:
1. 한국유소년체스연맹 인증서 보유자 (유효기간 내)
2. 대회 참가 신청서 제출 완료
3. 참가비 납부 완료 (대회별 상이)
4. 만 15세 이상 대한민국 국적자

등급별 추가 요건:
1. 전국 대회: 지역 예선 통과 또는 고급 이상 인증 보유
2. 전문 대회: 해당 분야 중급 이상 인증 보유
3. 신인 대회: 인증 취득 후 1년 이내, 초급 등급
4. 지역 대회: 해당 지역 거주 또는 소속 기관 위치 확인

제출 서류:
1. 대회 참가 신청서 1부
2. 인증서 사본 1부 (또는 온라인 인증 확인)
3. 신분증 사본 1부
4. 재직증명서 또는 재학증명서 1부 (해당 시)

참고: 대회별 세부 참가 요건은 상이할 수 있으며, 구체적인 사항은 각 대회 공고를 통해 안내됩니다. 참가 신청 마감일 이후에는 접수가 불가능하오니 기한 내에 신청해 주시기 바랍니다.

시상 제도

전국 인재 경진대회 기준 시상 내역입니다. 대회 규모에 따라 시상 내용이 달라질 수 있습니다.

대상 - 상금 500만원 + 트로피 / 전문가 등급 자동 승급, 해외 연수 기회 제공, 언론 보도
금상 - 상금 300만원 + 트로피 / 1등급 승급 우대, 전문 교육 과정 무료 수강권
은상 - 상금 200만원 + 메달 / 교육 과정 50% 할인, 멘토링 프로그램 참여 자격
동상 - 상금 100만원 + 메달 / 교육 과정 30% 할인, 우수 인재 네트워크 가입
장려상 - 상금 50만원 + 상장 / 교육 과정 20% 할인

시상 관련 안내:
- 상금은 제세공과금 공제 후 지급됩니다.
- 지역 대회 및 전문 대회의 시상 규모는 전국 대회의 50~70% 수준입니다.
- 동점자 발생 시 실기 평가 점수가 높은 참가자가 우선합니다.
- 수상 경력은 인증 갱신 및 등급 승급 심사 시 가점으로 적용됩니다.`;

  const [content, setContent] = useState(fallbackContent);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/competition")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content && data.content.trim()) setContent(data.content);
      })
      .catch(() => {});
  }, []);

  const startEdit = () => { setEditContent(content); setEditing(true); setSaved(false); };
  const cancelEdit = () => { setEditing(false); };
  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/page-content/competition", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: editContent }) });
      if (res.ok) { setContent(editContent); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch { alert("저장에 실패했습니다."); } finally { setSaving(false); }
  };

  const renderApiContent = () => (
    <div className="max-w-3xl mx-auto">
      <div className="prose prose-invert max-w-none">
        {content.split(/\n\n+/).map((paragraph, idx) => (
          <p key={idx} className="text-gray-300 leading-relaxed whitespace-pre-line">{paragraph}</p>
        ))}
      </div>
    </div>
  );

  const renderDefaultContent = () => (
    <>
      {/* Section 1: Competition types */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">대회 종류</h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">한국유소년체스연맹는 다양한 규모와 분야의 대회를 개최하여 인재들의 역량을 검증하고 성장을 지원합니다.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitionTypes.map((comp) => (
            <div key={comp.title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#c9a84c]/30 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center shrink-0 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                  <comp.icon className="w-6 h-6 text-[#c9a84c]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-white">{comp.title}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#d4b85c] border border-[#c9a84c]/20">{comp.level}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">{comp.description}</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#c9a84c]/60" />{comp.frequency}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#c9a84c]/60" />{comp.participants}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Participation requirements */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">참가 요건</h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">대회 참가를 위한 기본 요건과 준비 사항을 확인하세요.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requirements.map((req) => (
            <div key={req.title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-white/10">{req.title}</h3>
              <ul className="space-y-3">
                {req.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] text-xs font-semibold shrink-0 mt-0.5">{index + 1}</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-2xl p-5">
          <p className="text-sm text-gray-400 leading-relaxed">
            <span className="text-[#c9a84c] font-semibold">참고:</span> 대회별 세부 참가 요건은 상이할 수 있으며, 구체적인 사항은 각 대회 공고를 통해 안내됩니다. 참가 신청 마감일 이후에는 접수가 불가능하오니 기한 내에 신청해 주시기 바랍니다.
          </p>
        </div>
      </section>

      {/* Section 3: Award system */}
      <section className="mb-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">시상 제도</h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">전국 인재 경진대회 기준 시상 내역입니다. 대회 규모에 따라 시상 내용이 달라질 수 있습니다.</p>
        </div>
        <div className="space-y-4">
          {awards.map((award) => (
            <div key={award.rank} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${award.color} flex items-center justify-center shrink-0`}>
                  <award.icon className="w-7 h-7 text-[#0a1628]" />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
                  <div><span className="text-xs text-gray-500 block mb-1">등위</span><span className="text-lg font-bold text-white">{award.rank}</span></div>
                  <div><span className="text-xs text-gray-500 block mb-1">시상 내역</span><span className="text-sm text-[#d4b85c] font-medium">{award.prize}</span></div>
                  <div><span className="text-xs text-gray-500 block mb-1">추가 혜택</span><span className="text-sm text-gray-400">{award.benefits}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h4 className="text-base font-semibold text-white mb-3">시상 관련 안내</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-400"><span className="text-[#c9a84c] mt-0.5">&#8226;</span><span>상금은 제세공과금 공제 후 지급됩니다.</span></li>
            <li className="flex items-start gap-2 text-sm text-gray-400"><span className="text-[#c9a84c] mt-0.5">&#8226;</span><span>지역 대회 및 전문 대회의 시상 규모는 전국 대회의 50~70% 수준입니다.</span></li>
            <li className="flex items-start gap-2 text-sm text-gray-400"><span className="text-[#c9a84c] mt-0.5">&#8226;</span><span>동점자 발생 시 실기 평가 점수가 높은 참가자가 우선합니다.</span></li>
            <li className="flex items-start gap-2 text-sm text-gray-400"><span className="text-[#c9a84c] mt-0.5">&#8226;</span><span>수상 경력은 인증 갱신 및 등급 승급 심사 시 가점으로 적용됩니다.</span></li>
          </ul>
        </div>
      </section>
    </>
  );

  return (
    <>
      <PageBanner title="대회관련" breadcrumb={[{ label: "HOME", href: "/" }, { label: "종목정보", href: "/info" }, { label: "대회관련", href: "/info/competition" }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAdmin && !editing && (
          <div className="mb-6 flex items-center gap-3">
            <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-[#C5963A] text-white text-sm font-medium rounded-lg hover:bg-[#B08530] transition-colors">
              <Pencil className="w-4 h-4" />이 페이지 수정
            </button>
            {saved && <span className="text-green-500 text-sm">저장되었습니다!</span>}
          </div>
        )}
        {editing ? (
          <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#222]">페이지 수정</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">본문 내용 (문단 구분: 빈 줄)</label>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={15} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8] focus:ring-1 focus:ring-[#2B5BA8] leading-relaxed" />
            </div>
            <div className="flex gap-3">
              <button onClick={saveEdit} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#2B5BA8] text-white font-medium rounded-lg hover:bg-[#1E4A8F] transition-colors disabled:opacity-50"><Save className="w-4 h-4" />{saving ? "저장 중..." : "저장"}</button>
              <button onClick={cancelEdit} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"><X className="w-4 h-4" />취소</button>
            </div>
          </div>
        ) : content ? renderApiContent() : renderDefaultContent()}
      </div>
    </>
  );
}
