"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import {
  Pencil, Save, X,
  ClipboardCheck,
  FileText,
  MessageSquare,
  PenTool,
  Search,
  UserCheck,
} from "lucide-react";

const evaluationSteps = [
  { number: 1, icon: FileText, title: "지원서 제출", description: "온라인 시스템을 통해 지원서와 필수 서류를 제출합니다. 학력증명서, 경력증명서, 자기소개서 등이 필요합니다.", duration: "접수 기간 내" },
  { number: 2, icon: Search, title: "서류 심사", description: "제출된 서류를 전문 심사위원이 검토합니다. 기본 자격 요건 충족 여부와 지원 분야 적합성을 확인합니다.", duration: "약 2주 소요" },
  { number: 3, icon: PenTool, title: "필기 평가", description: "해당 분야의 이론적 지식과 전문 역량을 평가하는 필기시험을 실시합니다. 객관식과 서술형 문항으로 구성됩니다.", duration: "시험일 당일 (120분)" },
  { number: 4, icon: ClipboardCheck, title: "실기 평가", description: "실무 능력을 직접 평가합니다. 분야별 과제를 수행하며, 문제 해결 능력과 창의성을 종합적으로 심사합니다.", duration: "시험일 당일 (180분)" },
  { number: 5, icon: MessageSquare, title: "면접 심사", description: "전문 심사위원단과의 면접을 통해 인성, 전문성, 발전 가능성을 종합적으로 평가합니다.", duration: "1인당 약 20분" },
  { number: 6, icon: UserCheck, title: "최종 판정 및 인증", description: "모든 평가 결과를 종합하여 최종 인증 여부와 등급을 결정합니다. 합격자에게는 인증서가 발급됩니다.", duration: "결과 발표 약 4주 후" },
];

const criteriaData = [
  { category: "서류 심사", weight: "10%", details: "학력, 경력, 교육이수, 자격증 보유 현황", passingScore: "적격/부적격" },
  { category: "필기 평가", weight: "30%", details: "전공 이론, 시사 상식, 분야별 전문 지식", passingScore: "60점 이상" },
  { category: "실기 평가", weight: "40%", details: "실무 수행 능력, 문제 해결력, 창의성, 완성도", passingScore: "70점 이상" },
  { category: "면접 심사", weight: "20%", details: "인성, 전문성, 의사소통 능력, 발전 가능성", passingScore: "60점 이상" },
];

const gradingSystem = [
  { grade: "전문가", range: "총점 95점 이상", color: "from-[#c9a84c] to-[#e8d48b]", description: "해당 분야의 최고 수준의 역량을 갖춘 인재" },
  { grade: "고급", range: "총점 85점 이상", color: "from-[#c9a84c]/80 to-[#d4b85c]/80", description: "높은 전문성과 실무 능력을 겸비한 인재" },
  { grade: "중급", range: "총점 75점 이상", color: "from-[#c9a84c]/60 to-[#d4b85c]/60", description: "기본 역량을 갖추고 발전 가능성이 높은 인재" },
  { grade: "초급", range: "총점 65점 이상", color: "from-[#c9a84c]/40 to-[#d4b85c]/40", description: "기초 지식과 기본 소양을 갖춘 인재" },
];

export default function EvaluationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/evaluation")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content && data.content.trim()) {
          setContent(data.content);
        }
      })
      .catch(() => {});
  }, []);

  const startEdit = () => {
    setEditContent(content);
    setEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => { setEditing(false); };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/page-content/evaluation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        setContent(editContent);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch { alert("저장에 실패했습니다."); }
    finally { setSaving(false); }
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
      {/* Section 1: Step-by-step process */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">평가 절차</h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            한국유소년체스연맹 인증 평가는 총 6단계로 구성되며, 각 단계는 공정하고 투명한 기준에 따라 진행됩니다.
          </p>
        </div>
        <div className="space-y-4">
          {evaluationSteps.map((step) => (
            <div key={step.number} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#c9a84c]/30 transition-all duration-300 group">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#d4b85c] flex items-center justify-center text-[#0a1628] font-bold text-lg">{step.number}</div>
                  <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-colors duration-300 sm:hidden">
                    <step.icon className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 items-center justify-center group-hover:bg-[#c9a84c]/20 transition-colors duration-300 hidden sm:flex">
                      <step.icon className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-2">{step.description}</p>
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#c9a84c]/10 text-[#d4b85c] border border-[#c9a84c]/20">{step.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Evaluation criteria table */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">평가 기준</h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">각 평가 항목별 배점 비율과 합격 기준을 확인하세요.</p>
        </div>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-[#c9a84c]/10 border-b border-white/10">
            <span className="text-sm font-semibold text-[#c9a84c]">평가 항목</span>
            <span className="text-sm font-semibold text-[#c9a84c]">배점 비율</span>
            <span className="text-sm font-semibold text-[#c9a84c]">평가 내용</span>
            <span className="text-sm font-semibold text-[#c9a84c]">합격 기준</span>
          </div>
          {criteriaData.map((row, index) => (
            <div key={row.category} className={`grid grid-cols-4 gap-4 px-6 py-4 ${index < criteriaData.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/5 transition-colors duration-200`}>
              <span className="text-sm font-medium text-white">{row.category}</span>
              <span className="text-sm text-[#d4b85c] font-semibold">{row.weight}</span>
              <span className="text-sm text-gray-400">{row.details}</span>
              <span className="text-sm text-gray-300">{row.passingScore}</span>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-[#c9a84c]/5 border-t border-[#c9a84c]/20">
            <span className="text-sm font-bold text-white">합계</span>
            <span className="text-sm font-bold text-[#c9a84c]">100%</span>
            <span className="text-sm text-gray-400">전 항목 종합 평가</span>
            <span className="text-sm font-semibold text-[#c9a84c]">총점 65점 이상</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
          * 서류 심사는 적격/부적격으로 판정하며, 부적격 판정 시 이후 평가에 참여할 수 없습니다. 필기, 실기, 면접은 각 항목별 합격 기준을 충족해야 하며, 하나의 항목이라도 기준 미달 시 불합격 처리됩니다.
        </p>
      </section>

      {/* Section 3: Scoring/grading system */}
      <section className="mb-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">등급 체계</h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">총점에 따라 4개 등급으로 분류되며, 각 등급에 따른 인증서가 발급됩니다.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gradingSystem.map((item) => (
            <div key={item.grade} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.08] hover:border-[#c9a84c]/30 transition-all duration-300">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${item.color} mb-4`}>
                <span className="text-[#0a1628] font-bold text-lg">{item.grade.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{item.grade}</h3>
              <p className="text-sm text-[#d4b85c] font-medium mb-3">{item.range}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h4 className="text-base font-semibold text-white mb-3">유의사항</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-400"><span className="text-[#c9a84c] mt-0.5">&#8226;</span><span>인증 유효기간은 발급일로부터 3년이며, 갱신 심사를 통해 연장할 수 있습니다.</span></li>
            <li className="flex items-start gap-2 text-sm text-gray-400"><span className="text-[#c9a84c] mt-0.5">&#8226;</span><span>상위 등급으로의 승급 심사는 현 등급 취득 후 최소 1년이 경과한 후 신청 가능합니다.</span></li>
            <li className="flex items-start gap-2 text-sm text-gray-400"><span className="text-[#c9a84c] mt-0.5">&#8226;</span><span>평가 결과에 이의가 있는 경우, 결과 발표 후 14일 이내에 이의신청을 할 수 있습니다.</span></li>
            <li className="flex items-start gap-2 text-sm text-gray-400"><span className="text-[#c9a84c] mt-0.5">&#8226;</span><span>부정행위가 적발될 경우 인증이 취소되며, 향후 2년간 재응시가 제한됩니다.</span></li>
          </ul>
        </div>
      </section>
    </>
  );

  return (
    <>
      <PageBanner
        title="평가방법"
        breadcrumb={[
          { label: "HOME", href: "/" },
          { label: "종목정보", href: "/info" },
          { label: "평가방법", href: "/info/evaluation" },
        ]}
      />

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
              <button onClick={saveEdit} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#2B5BA8] text-white font-medium rounded-lg hover:bg-[#1E4A8F] transition-colors disabled:opacity-50">
                <Save className="w-4 h-4" />{saving ? "저장 중..." : "저장"}
              </button>
              <button onClick={cancelEdit} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                <X className="w-4 h-4" />취소
              </button>
            </div>
          </div>
        ) : content ? renderApiContent() : renderDefaultContent()}
      </div>
    </>
  );
}
