"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X, Target, Users, BookOpen, Award, TrendingUp, Globe } from "lucide-react";

const missions = [
  {
    icon: Users,
    title: "인재 양성",
    description:
      "체계적인 교육 프로그램을 통해 산업 현장에서 필요로 하는 전문 인력을 양성합니다.",
  },
  {
    icon: Award,
    title: "공정한 인증",
    description:
      "투명하고 신뢰할 수 있는 자격 인증 체계를 운영하여 개인의 전문성을 객관적으로 검증합니다.",
  },
  {
    icon: Globe,
    title: "사회 공헌",
    description:
      "소외 계층을 위한 교육 지원과 지역 사회 발전에 기여하며, 모두가 성장할 수 있는 환경을 만듭니다.",
  },
];

const goals = [
  {
    icon: Target,
    title: "2025년 자격 인증 15만 건 달성",
    description: "지속적인 시험 과목 확대와 응시자 편의성 향상",
  },
  {
    icon: BookOpen,
    title: "교육 프로그램 50종 이상 운영",
    description: "AI, 빅데이터, 그린에너지 등 미래 산업 분야 교육 확대",
  },
  {
    icon: TrendingUp,
    title: "전국 10개 교육센터 확보",
    description: "수도권 외 지방 접근성 향상을 위한 인프라 확충",
  },
  {
    icon: Globe,
    title: "해외 5개국 협력 네트워크 구축",
    description: "아시아 중심의 글로벌 인재 교류 프로그램 운영",
  },
];

export default function VisionPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/vision")
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

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/page-content/vision", {
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
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const renderApiContent = () => (
    <div className="max-w-3xl mx-auto">
      <div className="prose prose-invert max-w-none">
        {content.split(/\n\n+/).map((paragraph, idx) => (
          <p key={idx} className="text-gray-300 leading-relaxed whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );

  const renderDefaultContent = () => (
    <div className="space-y-20">
      {/* Vision Statement */}
      <section className="flex justify-center">
        <div className="relative max-w-2xl w-full rounded-2xl border border-[#c9a84c]/30 bg-gradient-to-br from-[#1a2744] to-[#111d35] p-10 text-center shadow-lg shadow-[#c9a84c]/5">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#c9a84c] rounded-full">
            <span className="text-xs font-bold text-[#0a1628] uppercase tracking-widest">
              Vision
            </span>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white leading-snug">
            사람의 가치를 높이는
            <br />
            <span className="text-[#c9a84c]">대한민국 인재 플랫폼</span>
          </h2>
          <p className="mt-4 text-gray-400 leading-relaxed">
            한국유소년체스연맹는 모든 사람이 자신의 잠재력을 발휘할 수 있도록
            교육과 인증의 기회를 제공하며, 대한민국 인재 생태계의
            중심이 되겠습니다.
          </p>
        </div>
      </section>

      {/* Mission Cards */}
      <section>
        <h3 className="text-center text-xl font-bold text-white mb-2">
          미션
        </h3>
        <p className="text-center text-gray-400 text-sm mb-10">
          한국유소년체스연맹가 추구하는 세 가지 핵심 가치
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <div
              key={mission.title}
              className="rounded-2xl border border-white/10 bg-[#111d35]/80 p-8 text-center hover:border-[#c9a84c]/30 transition-colors duration-300"
            >
              <div className="mx-auto w-14 h-14 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center mb-5">
                <mission.icon className="w-7 h-7 text-[#c9a84c]" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">
                {mission.title}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {mission.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Goals */}
      <section>
        <h3 className="text-center text-xl font-bold text-white mb-2">
          전략 목표
        </h3>
        <p className="text-center text-gray-400 text-sm mb-10">
          2025년까지의 주요 달성 목표
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <div
              key={goal.title}
              className="flex items-start gap-4 rounded-xl border border-white/5 bg-[#1a2744]/60 p-6 hover:bg-[#1a2744] transition-colors duration-300"
            >
              <div className="w-11 h-11 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                <goal.icon className="w-5 h-5 text-[#c9a84c]" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">
                  {goal.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {goal.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <>
      <PageBanner
        title="비전 및 목표"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "한국유소년체스연맹", href: "/about" },
          { label: "비전 및 목표", href: "/about/vision" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* 관리자 편집 버튼 */}
        {isAdmin && !editing && (
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={startEdit}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5963A] text-white text-sm font-medium rounded-lg hover:bg-[#B08530] transition-colors"
            >
              <Pencil className="w-4 h-4" />
              이 페이지 수정
            </button>
            {saved && (
              <span className="text-green-500 text-sm">저장되었습니다!</span>
            )}
          </div>
        )}

        {/* 편집 모드 */}
        {editing ? (
          <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#222]">페이지 수정</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">본문 내용 (문단 구분: 빈 줄)</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={15}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8] focus:ring-1 focus:ring-[#2B5BA8] leading-relaxed"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#2B5BA8] text-white font-medium rounded-lg hover:bg-[#1E4A8F] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                취소
              </button>
            </div>
          </div>
        ) : content ? (
          renderApiContent()
        ) : (
          renderDefaultContent()
        )}
      </div>
    </>
  );
}
