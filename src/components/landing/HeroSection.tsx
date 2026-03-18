"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    gradient: "linear-gradient(135deg, #1B2A4A, #2B5BA8)",
    title: "대한민국 인재의 미래를\n이끌어갑니다",
    subtitle: "체계적인 교육과 공정한 평가로 대한민국의 인재를 양성합니다",
    button: null,
  },
  {
    gradient: "linear-gradient(135deg, #2B5BA8, #1B6B5A)",
    title: "증명서 온라인 발급 서비스",
    subtitle: "각종 증명서를 온라인으로 간편하게 발급받으세요",
    button: { label: "발급 바로가기", href: "/certificate" },
  },
  {
    gradient: "linear-gradient(135deg, #1B2A4A, #3B2A6A)",
    title: "2026년 상반기\n교육과정 안내",
    subtitle: "지도사·심판 자격 교육과정 수강생을 모집합니다",
    button: { label: "교육과정 보기", href: "/education/instructor" },
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const goTo = useCallback((index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(index);
      setFade(true);
    }, 300);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full h-[420px] md:h-[480px] overflow-hidden"
      style={{ background: slide.gradient }}
    >
      {/* Slide content */}
      <div
        className="relative z-10 h-full max-w-[1200px] mx-auto px-6 flex flex-col justify-center transition-opacity duration-300 ease-in-out"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug whitespace-pre-line">
          {slide.title}
        </h2>
        <p className="text-base text-white/80 mt-4 max-w-md">
          {slide.subtitle}
        </p>
        {slide.button && (
          <div className="mt-6">
            <Link
              href={slide.button.href}
              className="inline-block bg-white text-[#1B2A4A] rounded px-6 py-2.5 text-sm font-medium hover:bg-white/90 transition"
            >
              {slide.button.label}
            </Link>
          </div>
        )}
      </div>

      {/* Left / Right arrows */}
      <button
        onClick={prev}
        aria-label="이전 슬라이드"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        aria-label="다음 슬라이드"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`슬라이드 ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === current ? "bg-[#C5963A]" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}