"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X } from "lucide-react";

const levels = [
  { level: "3급 심판", description: "시/도 단위 대회 심판 자격", duration: "60시간 (3주)", requirement: "만 20세 이상, 관련 분야 기본 지식 보유자", fee: "400,000원" },
  { level: "2급 심판", description: "전국 단위 대회 심판 자격", duration: "80시간 (4주)", requirement: "3급 심판 자격 취득 후 1년 이상 경력자", fee: "550,000원" },
  { level: "1급 심판", description: "국제 대회 심판 자격", duration: "100시간 (5주)", requirement: "2급 심판 자격 취득 후 2년 이상 경력자", fee: "700,000원" },
];

const curriculum = [
  { subject: "심판학 개론", hours: "8시간", description: "심판의 역할, 윤리, 책임에 대한 이론 교육" },
  { subject: "경기 규정 및 규칙", hours: "16시간", description: "각 종목별 경기 규정의 이해와 적용" },
  { subject: "판정 실무", hours: "20시간", description: "정확한 판정 기법 및 판정 기준 실습" },
  { subject: "영상 분석 및 기록", hours: "12시간", description: "경기 영상 분석 및 기록 관리 방법" },
  { subject: "갈등 관리 및 커뮤니케이션", hours: "8시간", description: "선수/코치와의 효과적인 소통 방법" },
  { subject: "현장 실습", hours: "24시간", description: "실제 대회 현장에서의 심판 실습" },
  { subject: "종합평가", hours: "12시간", description: "필기 및 실기 종합 평가" },
];

const scheduleData = [
  { round: "3급 제1기", period: "2026.04.14 ~ 2026.05.02", level: "3급", status: "접수중", seats: "25명" },
  { round: "2급 제1기", period: "2026.05.11 ~ 2026.06.06", level: "2급", status: "예정", seats: "20명" },
  { round: "3급 제2기", period: "2026.07.13 ~ 2026.07.31", level: "3급", status: "예정", seats: "25명" },
  { round: "1급 제1기", period: "2026.09.07 ~ 2026.10.10", level: "1급", status: "예정", seats: "15명" },
];

export default function RefereeCoursePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fallbackContent = `심판 양성과정

한국유소년체스연맹 심판 양성과정은 공정하고 전문적인 대회 운영을 위한 심판 인력을 체계적으로 양성합니다. 급수별 단계적 교육을 통해 시/도 대회부터 국제 대회까지 활동할 수 있는 자격을 부여합니다.

심판 등급 안내:
- 3급 심판: 시/도 단위 대회 심판 자격 / 60시간 (3주) / 400,000원 / 만 20세 이상, 관련 분야 기본 지식 보유자
- 2급 심판: 전국 단위 대회 심판 자격 / 80시간 (4주) / 550,000원 / 3급 심판 자격 취득 후 1년 이상 경력자
- 1급 심판: 국제 대회 심판 자격 / 100시간 (5주) / 700,000원 / 2급 심판 자격 취득 후 2년 이상 경력자

교육과정 (3급 기준, 총 100시간):
* 2급/1급 과정은 심화 내용이 추가됩니다.
- 심판학 개론: 8시간 / 심판의 역할, 윤리, 책임에 대한 이론 교육
- 경기 규정 및 규칙: 16시간 / 각 종목별 경기 규정의 이해와 적용
- 판정 실무: 20시간 / 정확한 판정 기법 및 판정 기준 실습
- 영상 분석 및 기록: 12시간 / 경기 영상 분석 및 기록 관리 방법
- 갈등 관리 및 커뮤니케이션: 8시간 / 선수/코치와의 효과적인 소통 방법
- 현장 실습: 24시간 / 실제 대회 현장에서의 심판 실습
- 종합평가: 12시간 / 필기 및 실기 종합 평가

2026년 교육일정:
- 3급 제1기: 2026.04.14 ~ 2026.05.02 / 3급 / 25명 / 접수중
- 2급 제1기: 2026.05.11 ~ 2026.06.06 / 2급 / 20명 / 예정
- 3급 제2기: 2026.07.13 ~ 2026.07.31 / 3급 / 25명 / 예정
- 1급 제1기: 2026.09.07 ~ 2026.10.10 / 1급 / 15명 / 예정

문의전화: 02-1234-5678 (평일 09:00~18:00)`;

  const [content, setContent] = useState(fallbackContent);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/referee")
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
      const res = await fetch("/api/page-content/referee", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: editContent }) });
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
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">심판 <span className="text-[#c9a84c]">양성과정</span></h2>
        <p className="text-gray-400 leading-relaxed max-w-3xl">한국유소년체스연맹 심판 양성과정은 공정하고 전문적인 대회 운영을 위한 심판 인력을 체계적으로 양성합니다. 급수별 단계적 교육을 통해 시/도 대회부터 국제 대회까지 활동할 수 있는 자격을 부여합니다.</p>
      </div>

      {/* Level Cards */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-6">심판 등급 안내</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((item, index) => (
            <div key={item.level} className={`rounded-xl border bg-[#111d35]/80 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#c9a84c]/40 ${index === 2 ? "border-[#c9a84c]/30 ring-1 ring-[#c9a84c]/10" : "border-white/10"}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white">{item.level}</h4>
                {index === 2 && <span className="text-xs px-2 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c] font-semibold">최상위</span>}
              </div>
              <p className="text-[#d4b85c] text-sm font-medium mb-4">{item.description}</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">교육시간</span><span className="text-white">{item.duration}</span></div>
                <div className="w-full h-px bg-white/5" />
                <div className="flex justify-between"><span className="text-gray-400">교육비</span><span className="text-white font-semibold">{item.fee}</span></div>
                <div className="w-full h-px bg-white/5" />
                <div><span className="text-gray-400">지원자격</span><p className="text-gray-300 mt-1">{item.requirement}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum Table */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-2">교육과정 (3급 기준, 총 100시간)</h3>
        <p className="text-gray-500 text-sm mb-6">* 2급/1급 과정은 심화 내용이 추가됩니다.</p>
        <div className="rounded-xl border border-white/10 overflow-hidden bg-[#111d35]/80 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#1a2744]"><th className="px-6 py-4 text-left text-[#c9a84c] font-semibold">과목명</th><th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">시간</th><th className="px-6 py-4 text-left text-[#c9a84c] font-semibold">내용</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {curriculum.map((item, index) => (
                  <tr key={item.subject} className={`hover:bg-[#c9a84c]/5 transition-colors ${index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}>
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
              <thead><tr className="bg-[#1a2744]"><th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">과정</th><th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">등급</th><th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">교육기간</th><th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">모집인원</th><th className="px-6 py-4 text-center text-[#c9a84c] font-semibold">접수상태</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {scheduleData.map((item, index) => (
                  <tr key={item.round} className={`hover:bg-[#c9a84c]/5 transition-colors ${index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}>
                    <td className="px-6 py-4 text-white font-medium text-center">{item.round}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.level === "1급" ? "bg-[#c9a84c]/20 text-[#c9a84c]" : item.level === "2급" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"}`}>{item.level}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-center">{item.period}</td>
                    <td className="px-6 py-4 text-gray-300 text-center">{item.seats}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${item.status === "접수중" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button className="px-10 py-4 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-[#c9a84c]/25 transition-all duration-300 transform hover:-translate-y-0.5">심판 과정 신청하기</button>
        <p className="mt-3 text-sm text-gray-500">문의전화: 02-1234-5678 (평일 09:00~18:00)</p>
      </div>
    </>
  );

  return (
    <>
      <PageBanner title="심판 과정안내" breadcrumb={[{ label: "홈", href: "/" }, { label: "교육/연수", href: "/education" }, { label: "심판 과정안내", href: "/education/referee" }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAdmin && !editing && (
          <div className="mb-6 flex items-center gap-3">
            <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-[#C5963A] text-white text-sm font-medium rounded-lg hover:bg-[#B08530] transition-colors"><Pencil className="w-4 h-4" />이 페이지 수정</button>
            {saved && <span className="text-green-500 text-sm">저장되었습니다!</span>}
          </div>
        )}
        {editing ? (
          <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#222]">페이지 수정</h3>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">본문 내용 (문단 구분: 빈 줄)</label><textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={15} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8] focus:ring-1 focus:ring-[#2B5BA8] leading-relaxed" /></div>
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
