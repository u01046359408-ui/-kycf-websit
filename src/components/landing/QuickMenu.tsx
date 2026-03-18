"use client";

import Link from "next/link";
import {
  Star,
  Calendar,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MapPin,
} from "lucide-react";

const menuItems = [
  { icon: Star, label: "레이팅 및 선수명단", href: "/ratings" },
  { icon: Calendar, label: "행사일정", href: "/events/schedule" },
  { icon: ClipboardCheck, label: "참가신청", href: "/apply" },
  { icon: FileText, label: "증명서발급", href: "/certificate" },
  { icon: GraduationCap, label: "교육과정", href: "/education/instructor" },
  { icon: MapPin, label: "오시는길", href: "/about/location" },
];

export default function QuickMenu() {
  return (
    <section className="bg-[#243557] py-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center transition-colors group-hover:border-[#C5963A] group-hover:bg-[#C5963A]/10">
                  <Icon className="w-6 h-6 text-white transition-colors group-hover:text-[#C5963A]" />
                </div>
                <span className="text-xs text-white/80 font-medium transition-colors group-hover:text-white">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}