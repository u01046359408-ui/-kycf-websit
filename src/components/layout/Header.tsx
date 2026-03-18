"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import LoginModal from "@/components/ui/LoginModal";

interface SubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  subItems: SubItem[];
}

const navItems: NavItem[] = [
  {
    label: "대한인재",
    href: "/about",
    subItems: [
      { label: "인사말", href: "/about/greeting" },
      { label: "연혁", href: "/about/history" },
      { label: "비전 및 목표", href: "/about/vision" },
      { label: "주요사업", href: "/about/business" },
      { label: "조직도", href: "/about/organization" },
      { label: "오시는길", href: "/about/location" },
      { label: "후원사", href: "/about/sponsors" },
      { label: "규정", href: "/about/regulations" },
      { label: "경영공시", href: "/about/disclosure" },
    ],
  },
  {
    label: "종목정보",
    href: "/info",
    subItems: [
      { label: "인재란", href: "/info/about-talent" },
      { label: "평가방법", href: "/info/evaluation" },
      { label: "대회관련", href: "/info/competition" },
      { label: "경기규정", href: "/info/regulations" },
      { label: "윤리강령", href: "/info/ethics" },
    ],
  },
  {
    label: "행사/인재",
    href: "/events",
    subItems: [
      { label: "행사일정", href: "/events/schedule" },
      { label: "국외 결과", href: "/events/results-international" },
      { label: "국내 결과", href: "/events/results-domestic" },
      { label: "대회기록", href: "/events/records" },
    ],
  },
  {
    label: "교육/연수",
    href: "/education",
    subItems: [
      { label: "지도사 과정안내", href: "/education/instructor" },
      { label: "지도사 공지사항", href: "/education/instructor-notice" },
      { label: "심판 과정안내", href: "/education/referee" },
      { label: "심판 공지사항", href: "/education/referee-notice" },
    ],
  },
  {
    label: "알림마당",
    href: "/notice",
    subItems: [
      { label: "공지사항", href: "/notice/announcements" },
      { label: "사진자료실", href: "/notice/gallery" },
      { label: "후원 및 기부", href: "/notice/support" },
      { label: "구인/구직", href: "/notice/jobs" },
      { label: "E-Shop", href: "/notice/shop" },
    ],
  },
];

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const toggleMobileAccordion = (index: number) => {
    setMobileAccordion(mobileAccordion === index ? null : index);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Tier 1 - Top utility bar */}
        <div className="bg-[#1B2A4A]">
          <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-9">
            {/* Left: HOME | 사이트맵 */}
            <div className="hidden lg:flex items-center gap-0 text-xs text-white/70">
              <Link
                href="/"
                className="hover:text-white transition-colors duration-200"
              >
                HOME
              </Link>
              <span className="mx-2 text-white/30">|</span>
              <Link
                href="/sitemap"
                className="hover:text-white transition-colors duration-200"
              >
                사이트맵
              </Link>
            </div>

            {/* Right: Login state */}
            <div className="hidden lg:flex items-center gap-0 text-xs text-white/70 ml-auto">
              {loading ? (
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="hover:text-white transition-colors duration-200"
                >
                  로그인
                </button>
              ) : user ? (
                <>
                  <Link
                    href="/mypage"
                    className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                  >
                    <User className="w-3 h-3" />
                    {user.name || "마이페이지"}
                  </Link>
                  {user.role === "admin" && (
                    <>
                      <span className="mx-2 text-white/30">|</span>
                      <Link
                        href="/admin"
                        className="hover:text-white transition-colors duration-200"
                      >
                        관리자
                      </Link>
                    </>
                  )}
                  <span className="mx-2 text-white/30">|</span>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                    aria-label="로그아웃"
                  >
                    <LogOut className="w-3 h-3" />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="hover:text-white transition-colors duration-200"
                  >
                    로그인
                  </button>
                  <span className="mx-2 text-white/30">|</span>
                  <Link
                    href="/register"
                    className="hover:text-white transition-colors duration-200"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2 - Main navigation bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              {/* Shield SVG Icon */}
              <svg
                width="36"
                height="40"
                viewBox="0 0 36 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M18 0L35 7V18C35 29.5 27.5 36 18 40C8.5 36 1 29.5 1 18V7L18 0Z"
                  fill="#1B2A4A"
                />
                <path
                  d="M18 3L32 9V18C32 27.8 25.5 33.5 18 37C10.5 33.5 4 27.8 4 18V9L18 3Z"
                  fill="#2B5BA8"
                />
                <path
                  d="M18 8L27 12V18C27 24.5 23 28.5 18 31C13 28.5 9 24.5 9 18V12L18 8Z"
                  fill="#1B2A4A"
                />
                <text
                  x="18"
                  y="22"
                  textAnchor="middle"
                  fill="#C5963A"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="serif"
                >
                  大
                </text>
              </svg>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-tight">
                  <span className="text-[#1B2A4A] font-extrabold">대한</span>
                  <span className="text-[#1B2A4A]">인재</span>
                </span>
                <span className="text-[10px] text-gray-400 tracking-[0.15em] leading-none mt-0.5">
                  DAEHAN TALENT
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center h-full">
              {navItems.map((item, index) => (
                <div
                  key={item.href}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(index)}
                >
                  <Link
                    href={item.href}
                    className={`relative px-5 h-full flex items-center text-[15px] font-medium transition-colors duration-200 ${
                      activeMenu === index
                        ? "text-[#1B2A4A]"
                        : "text-gray-700 hover:text-[#1B2A4A]"
                    }`}
                  >
                    {item.label}
                    {/* Gold bottom border on hover/active */}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#C5963A] transition-transform duration-200 origin-center ${
                        activeMenu === index ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#1B2A4A] hover:bg-gray-100 transition-colors duration-200"
              aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Dropdown Panel */}
        <div
          className={`hidden lg:block absolute left-0 w-full transition-all duration-200 ease-in-out ${
            activeMenu !== null
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none"
          }`}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-white border-t-[3px] border-[#2B5BA8] shadow-lg">
            <div className="max-w-[1200px] mx-auto px-6 py-5">
              {activeMenu !== null && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-bold text-[#2B5BA8] tracking-wide mb-3 pb-2 border-b border-gray-100">
                    {navItems[activeMenu].label}
                  </p>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-0.5">
                    {navItems[activeMenu].subItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="text-sm text-gray-600 hover:text-[#2B5BA8] transition-colors duration-200 py-1.5 px-2 rounded hover:bg-blue-50/50"
                        onClick={() => setActiveMenu(null)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Slide-in Sheet from Right */}
        <div
          className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />

          <div
            className={`absolute top-0 right-0 h-full w-[320px] max-w-[85vw] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.12)] overflow-y-auto transition-transform duration-300 ease-out ${
              mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#1B2A4A]">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg font-bold tracking-tight">
                  <span className="text-white font-extrabold">대한</span>
                  <span className="text-white/80">인재</span>
                </span>
              </Link>
              <button
                className="flex items-center justify-center w-9 h-9 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="메뉴 닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile user area */}
            <div className="px-5 py-3 bg-[#1B2A4A]/5 border-b border-gray-200 text-sm">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link
                    href="/mypage"
                    className="flex items-center gap-1.5 text-[#1B2A4A] font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    {user.name || "마이페이지"}
                  </Link>
                  <div className="flex items-center gap-2">
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="text-[#2B5BA8] font-medium"
                        onClick={() => setMobileOpen(false)}
                      >
                        관리자
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="로그아웃"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="text-[#1B2A4A] font-medium hover:text-[#2B5BA8] transition-colors"
                  >
                    로그인
                  </button>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/register"
                    className="text-gray-500 hover:text-[#2B5BA8] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile navigation */}
            <nav className="px-3 py-2">
              {navItems.map((item, index) => (
                <div key={item.href} className="border-b border-gray-100">
                  <button
                    className="w-full flex items-center justify-between px-3 py-3.5 text-[15px] font-medium text-[#1B2A4A] hover:text-[#2B5BA8] transition-colors"
                    onClick={() => toggleMobileAccordion(index)}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                        mobileAccordion === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      mobileAccordion === index
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pb-3 pl-2 space-y-0.5">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-[#2B5BA8] hover:bg-blue-50/50 rounded transition-colors duration-200"
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Mobile bottom CTA */}
            <div className="px-5 py-5 mt-2 border-t border-gray-200">
              <Link
                href="/certificate"
                className="block w-full text-center py-3 text-sm font-medium bg-[#2B5BA8] hover:bg-[#1B2A4A] text-white rounded transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                증명서 발급
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}