"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ─────────────────────────── DATA ─────────────────────────── */

const stats = [
  { value: 12000, suffix: "+", label: "인증 인재" },
  { value: 150, suffix: "+", label: "교육 과정" },
  { value: 50, suffix: "+", label: "제휴 기관" },
  { value: 99, suffix: "%", label: "만족도" },
];

const eventNotices = [
  { date: "2026.03.15", title: "제42회 전국 장기대회 개최 안내" },
  { date: "2026.03.10", title: "2026 상반기 체스 챔피언십 참가자 모집" },
  { date: "2026.02.28", title: "제15회 청소년 바둑 인재선발전 결과 발표" },
  { date: "2026.02.20", title: "2026 국제 두뇌스포츠 교류전 일정 공지" },
  { date: "2026.02.15", title: "제38회 여성부 장기대회 접수 시작" },
];

const federationNotices = [
  { date: "2026.03.12", title: "2026년도 정기총회 개최 안내" },
  { date: "2026.03.05", title: "심판자격증 갱신 교육 일정 안내" },
  { date: "2026.02.25", title: "지부 및 지회 등록 갱신 공지" },
  { date: "2026.02.18", title: "2026년 연간 사업계획서 공개" },
  { date: "2026.02.10", title: "이사회 회의록 공개 (제127차)" },
];

const upcomingEvents = [
  {
    date: "2026.04.05",
    name: "제43회 전국 장기대회",
    location: "서울 올림픽공원 체조경기장",
    status: "접수중" as const,
  },
  {
    date: "2026.04.18",
    name: "2026 체스 챔피언십",
    location: "부산 벡스코 컨벤션홀",
    status: "마감" as const,
  },
  {
    date: "2026.05.10",
    name: "제16회 청소년 바둑 인재선발전",
    location: "대전 컨벤션센터",
    status: "예정" as const,
  },
];

/* ──────────────────── HOOKS ──────────────────── */

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [start]);

  return { count, ref };
}

/* ────────────────── HELPERS ────────────────── */

function formatNumber(n: number): string {
  return n.toLocaleString();
}

const statusStrip: Record<string, string> = {
  접수중: "bg-[#2B5BA8]",
  마감: "bg-gray-300",
  예정: "bg-emerald-500",
};

const statusBadge: Record<string, string> = {
  접수중: "bg-blue-50 text-[#2B5BA8]",
  마감: "bg-gray-100 text-gray-400",
  예정: "bg-emerald-50 text-emerald-600",
};

/* ────────────────── SUB-COMPONENTS ────────────────── */

function StatItem({
  value,
  suffix,
  label,
  delay,
  isLast,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  isLast: boolean;
}) {
  const { count, ref } = useCountUp(value, 2000 + delay * 200);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-2 py-4 ${
        !isLast ? "md:border-r md:border-gray-200" : ""
      }`}
    >
      <div className="text-3xl font-bold text-[#1B2A4A] tracking-tight tabular-nums">
        {formatNumber(count)}
        {suffix}
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */

export default function ContentSection() {
  const [activeTab, setActiveTab] = useState<"event" | "federation">("event");

  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const currentNotices =
    activeTab === "event" ? eventNotices : federationNotices;

  return (
    <>
      {/* Section A: Stats */}
      <section className="bg-[#F5F7FA]">
        <div className="fade-in-section max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <StatItem
                key={stat.label}
                {...stat}
                delay={i}
                isLast={i === stats.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section B: Greeting + Notice */}
      <section className="bg-white">
        <div className="fade-in-section max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Greeting */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#222] mb-6 pl-4 border-l-4 border-[#2B5BA8]">
                인사말
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  안녕하십니까. 대한인재를 찾아주신 여러분을 진심으로 환영합니다.
                  대한인재는 대한민국의 미래를 이끌어갈 인재를 발굴하고 육성하기
                  위해 설립된 기관으로, 체계적인 교육 프로그램과 공정한 평가
                  시스템을 통해 각 분야의 우수 인재를 양성하고 있습니다.
                </p>
                <p>
                  저희는 전통 문화와 현대적 역량을 결합한 통합 교육을 지향하며,
                  장기, 바둑, 체스 등 두뇌스포츠를 통한 논리적 사고력 함양은
                  물론, 리더십과 협동심을 기를 수 있는 다양한 프로그램을 운영하고
                  있습니다. 매년 수천 명의 참가자가 함께하는 전국 규모의 대회를
                  개최하여 인재들이 실력을 겨루고 성장할 수 있는 무대를
                  제공합니다.
                </p>
              </div>
              <Link
                href="/about/greeting"
                className="inline-block mt-6 text-[#2B5BA8] font-medium hover:underline"
              >
                자세히 보기 &rarr;
              </Link>
            </div>

            {/* Right: Notice with tabs */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-lg p-5">
                {/* Tab buttons */}
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    onClick={() => setActiveTab("event")}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                      activeTab === "event"
                        ? "border-b-2 border-[#2B5BA8] text-[#2B5BA8]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    행사공지
                  </button>
                  <button
                    onClick={() => setActiveTab("federation")}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                      activeTab === "federation"
                        ? "border-b-2 border-[#2B5BA8] text-[#2B5BA8]"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    연맹공지
                  </button>
                </div>

                {/* Notice list */}
                <ul className="space-y-3">
                  {currentNotices.map((item, i) => (
                    <li key={i}>
                      <Link href="#" className="flex items-start gap-3 group">
                        <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums pt-0.5">
                          {item.date}
                        </span>
                        <span className="text-sm text-gray-700 group-hover:text-[#2B5BA8] transition-colors line-clamp-1">
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* More link */}
                <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                  <Link
                    href="#"
                    className="text-sm text-[#2B5BA8] font-medium hover:underline"
                  >
                    더보기 +
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Upcoming Events */}
      <section className="bg-[#F5F7FA]">
        <div className="fade-in-section max-w-[1200px] mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-[#222] text-center mb-10">
            다가오는 행사
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <div
                key={i}
                className="bg-white rounded-lg card-shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Colored top strip */}
                <div className={`h-1 ${statusStrip[event.status]}`} />

                {/* Body */}
                <div className="p-6">
                  <p className="text-sm text-gray-400 mb-2">{event.date}</p>
                  <h3 className="text-lg font-semibold text-[#222] mb-2">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {event.location}
                  </p>

                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusBadge[event.status]}`}
                  >
                    {event.status === "접수중" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2B5BA8] animate-pulse" />
                    )}
                    {event.status}
                  </span>

                  {/* Detail link */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <Link
                      href="#"
                      className="text-sm text-[#2B5BA8] font-medium hover:underline"
                    >
                      상세보기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
