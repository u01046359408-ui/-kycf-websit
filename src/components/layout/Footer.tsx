import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "한국유소년체스연맹 소개", href: "/about" },
  { label: "종목정보", href: "/info" },
  { label: "행사/인재", href: "/events" },
  { label: "알림마당", href: "/notice" },
  { label: "갤러리", href: "/notice/gallery" },
];

const educationLinks = [
  { label: "지도사 과정안내", href: "/education/instructor" },
  { label: "지도사 공지사항", href: "/education/instructor-notice" },
  { label: "심판 과정안내", href: "/education/referee" },
  { label: "심판 공지사항", href: "/education/referee-notice" },
];

const legalLinks = [
  { label: "개인정보처리방침", href: "/privacy", bold: true },
  { label: "이용약관", href: "/terms", bold: false },
  { label: "이메일무단수집거부", href: "/email-policy", bold: false },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#1B2A4A] text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1: Logo + Description */}
          <div>
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-horizontal_2.png"
                alt="한국유소년체스연맹"
                style={{ height: "50px", width: "auto" }}
              />
            </Link>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              한국유소년체스연맹는 대한민국 인재 육성과 발전을 위해 노력하는 기관입니다.
              교육, 연수, 행사를 통해 미래를 이끌어갈 인재를 양성합니다.
            </p>
          </div>

          {/* Col 2: Quick Links (2 sub-columns) */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                바로가기
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                교육/연수
              </h3>
              <ul className="space-y-2.5">
                {educationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">연락처</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white/40 shrink-0" />
                <div>
                  <p className="text-sm text-white/60">02-1234-5678</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    평일 09:00 - 18:00
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white/40 shrink-0" />
                <p className="text-sm text-white/60">info@daehantalent.kr</p>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <p className="text-sm text-white/60 leading-relaxed">
                  서울특별시 중구 세종대로 110
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs">
            {legalLinks.map((link, index) => (
              <span key={link.href} className="flex items-center gap-3">
                {index > 0 && <span className="text-white/20">|</span>}
                <Link
                  href={link.href}
                  className={`hover:text-white transition-colors duration-200 ${
                    link.bold
                      ? "font-bold text-white"
                      : "text-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} 한국유소년체스연맹. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
