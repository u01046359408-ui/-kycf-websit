"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";

const defaultHistoryData = [
  {
    year: "2024",
    events: [
      { month: "03", text: "AI 기반 자격 인증 시스템 도입" },
      { month: "06", text: "교육부 우수 교육기관 재인증 획득" },
      { month: "11", text: "제5회 대한민국 인재대상 시상식 개최" },
    ],
  },
  {
    year: "2023",
    events: [
      { month: "02", text: "온라인 교육 플랫폼 전면 개편" },
      { month: "05", text: "베트남 인재개발원과 국제 협력 MOU 체결" },
      { month: "09", text: "누적 자격증 발급 10만 건 달성" },
    ],
  },
  {
    year: "2022",
    events: [
      { month: "01", text: "사회적기업 인증 획득" },
      { month: "07", text: "전국 5개 지역 교육센터 개소" },
      { month: "12", text: "고용노동부 직업능력개발 우수기관 선정" },
    ],
  },
  {
    year: "2021",
    events: [
      { month: "03", text: "비대면 시험 감독 시스템 개발 및 도입" },
      { month: "08", text: "산업통상자원부 공동 인재양성 사업 수주" },
    ],
  },
  {
    year: "2020",
    events: [
      { month: "01", text: "(사)한국유소년체스연맹 법인 설립" },
      { month: "04", text: "초대 이사장 취임" },
      { month: "09", text: "제1회 자격 인증 시험 시행" },
    ],
  },
];

export default function HistoryPage() {
  const [apiContent, setApiContent] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/page-content/history")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.content && data.content.trim()) {
          setApiContent(data.content);
        }
      })
      .catch(() => {
        // fallback to hardcoded content
      });
  }, []);

  // If API content is available, render it as free-form text
  const renderApiContent = () => (
    <div className="max-w-3xl mx-auto">
      <div className="prose prose-invert max-w-none">
        {apiContent!.split(/\n\n+/).map((paragraph, idx) => (
          <p key={idx} className="text-gray-300 leading-relaxed whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );

  // Default timeline rendering
  const renderTimeline = () => (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-[#c9a84c] via-[#c9a84c]/40 to-transparent hidden sm:block" />

        {defaultHistoryData.map((yearGroup) => (
          <div key={yearGroup.year} className="mb-12 last:mb-0">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-[6.5rem] text-right text-2xl font-bold text-[#c9a84c] shrink-0">
                {yearGroup.year}
              </span>
              <div className="hidden sm:flex w-3 h-3 rounded-full bg-[#c9a84c] border-2 border-[#0a1628] ring-2 ring-[#c9a84c]/30 shrink-0 z-10" />
              <div className="h-px flex-1 bg-white/10 hidden sm:block" />
            </div>

            <div className="space-y-4 sm:ml-[8.75rem]">
              {yearGroup.events.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <span className="text-sm text-[#c9a84c] font-medium shrink-0 pt-0.5">
                    {event.month}월
                  </span>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-200">
                    {event.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <PageBanner
        title="연혁"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "한국유소년체스연맹", href: "/about" },
          { label: "연혁", href: "/about/history" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {apiContent ? renderApiContent() : renderTimeline()}
      </div>
    </>
  );
}
