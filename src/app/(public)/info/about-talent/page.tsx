"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import {
  Pencil, Save, X,
  Award,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const certificationCards = [
  {
    icon: Target,
    title: "역량 기반 평가",
    description:
      "개인의 전문 역량과 잠재력을 체계적으로 평가하여 공정하고 객관적인 인증을 제공합니다.",
  },
  {
    icon: Shield,
    title: "공인 인증 시스템",
    description:
      "한국유소년체스연맹가 공식적으로 인정하는 인증서를 발급하며, 이는 국내외에서 공신력을 갖춘 자격 증명입니다.",
  },
  {
    icon: GraduationCap,
    title: "단계별 등급 체계",
    description:
      "초급, 중급, 고급, 전문가 등 4단계 등급 체계를 통해 지속적인 성장과 발전을 지원합니다.",
  },
  {
    icon: Users,
    title: "커뮤니티 네트워크",
    description:
      "인증을 받은 인재들 간의 교류와 협력을 촉진하는 전국적 네트워크를 운영합니다.",
  },
];

const systemSteps = [
  {
    step: "01",
    title: "지원 및 접수",
    description: "온라인 또는 오프라인으로 인증 평가에 지원합니다. 필요한 서류를 제출하고 평가 일정을 확인합니다.",
  },
  {
    step: "02",
    title: "서류 심사",
    description: "제출된 서류를 기반으로 기본 자격 요건 충족 여부를 심사합니다. 학력, 경력, 교육 이수 내역 등을 확인합니다.",
  },
  {
    step: "03",
    title: "실기 평가",
    description: "해당 분야의 전문 역량을 직접 평가합니다. 실무 능력, 문제 해결 능력, 창의성 등을 종합적으로 심사합니다.",
  },
  {
    step: "04",
    title: "인증서 발급",
    description: "평가를 통과한 지원자에게 공식 인증서를 발급합니다. 인증서는 온라인에서도 진위 확인이 가능합니다.",
  },
];

const benefits = [
  {
    icon: Award,
    title: "공식 자격 증명",
    description: "한국유소년체스연맹 공인 인증서를 통해 전문성을 공식적으로 입증할 수 있습니다.",
  },
  {
    icon: TrendingUp,
    title: "경력 개발 지원",
    description: "인증 등급에 따른 맞춤형 교육 프로그램과 경력 개발 컨설팅을 제공합니다.",
  },
  {
    icon: BookOpen,
    title: "교육 기회 확대",
    description: "인증 보유자에게 전문 교육 과정 우선 등록 및 수강료 할인 혜택을 드립니다.",
  },
  {
    icon: Star,
    title: "대회 참가 자격",
    description: "인증 등급에 따라 각종 대회 및 경진대회 참가 자격이 부여됩니다.",
  },
  {
    icon: Users,
    title: "네트워킹 기회",
    description: "동일 분야 인증 보유자들과의 교류 및 멘토링 프로그램에 참여할 수 있습니다.",
  },
  {
    icon: CheckCircle,
    title: "취업 및 진학 우대",
    description: "협력 기관 취업 시 우대 혜택과 대학원 진학 시 가산점이 적용됩니다.",
  },
];

export default function AboutTalentPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fallbackContent = `한국유소년체스연맹 인증 제도는 각 분야에서 뛰어난 역량과 잠재력을 갖춘 인재를 공식적으로 인정하고 증명하는 국가 공인 인증 시스템입니다. 체계적인 평가 과정을 통해 개인의 전문성을 객관적으로 검증하며, 인증을 받은 인재에게는 다양한 혜택과 기회를 제공합니다.`;

  const [content, setContent] = useState(fallbackContent);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/about-talent")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content && data.content.trim() && data.content.length <= 500) {
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
      const res = await fetch("/api/page-content/about-talent", {
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

  const renderDefaultContent = () => (
    <>
      {/* Section 1: What is talent certification */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            인재 인증이란?
          </h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
          <div className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg space-y-3">
            {content.split(/\n\n+/).filter(p => p.trim()).map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificationCards.map((card) => (
            <div
              key={card.title}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#c9a84c]/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center mb-4 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                <card.icon className="w-6 h-6 text-[#c9a84c]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: System explanation */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            인증 절차 안내
          </h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            한국유소년체스연맹 인증은 아래의 4단계 절차를 통해 진행됩니다. 각 단계는
            공정성과 투명성을 기반으로 운영됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemSteps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < systemSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%+0.25rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-[#c9a84c]/40 to-transparent z-0" />
              )}
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 relative z-10">
                <span className="text-3xl font-black text-[#c9a84c]/20 absolute top-4 right-4">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#d4b85c] flex items-center justify-center text-[#0a1628] font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Benefits of certification */}
      <section className="mb-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            인증 혜택
          </h2>
          <div className="w-12 h-0.5 bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            한국유소년체스연맹 인증을 취득하면 다양한 분야에서 혜택을 누릴 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:border-[#c9a84c]/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0 group-hover:bg-[#c9a84c]/20 transition-colors duration-300">
                  <benefit.icon className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#c9a84c]/10 via-[#1a2744] to-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-2xl p-8 sm:p-12 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
          인재 인증에 도전하세요
        </h3>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          지금 바로 한국유소년체스연맹 인증 평가에 지원하여 당신의 전문성을 공식적으로
          인정받으세요.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="/events"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold text-sm hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all duration-300"
          >
            평가 일정 확인
          </a>
          <a
            href="/info/evaluation"
            className="inline-flex items-center px-6 py-3 rounded-xl border border-[#c9a84c]/40 text-[#c9a84c] font-semibold text-sm hover:bg-[#c9a84c]/10 transition-all duration-300"
          >
            평가 방법 알아보기
          </a>
        </div>
      </section>
    </>
  );

  return (
    <>
      <PageBanner
        title="인재란"
        breadcrumb={[
          { label: "HOME", href: "/" },
          { label: "종목정보", href: "/info" },
          { label: "인재란", href: "/info/about-talent" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        ) : (
          renderDefaultContent()
        )}
      </div>
    </>
  );
}
