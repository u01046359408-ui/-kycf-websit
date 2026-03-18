"use client";

import Link from "next/link";
import { FileText, Image, Calendar, Briefcase } from "lucide-react";

const contentTypes = [
  {
    label: "공지사항",
    href: "/admin/content/announcements",
    icon: FileText,
    description: "연맹공지, 행사공지 등록 및 관리",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "사진자료실",
    href: "/admin/content/gallery",
    icon: Image,
    description: "사진 및 갤러리 콘텐츠 관리",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "행사일정",
    href: "/admin/content/events",
    icon: Calendar,
    description: "행사 및 대회 일정 관리",
    color: "text-[#c9a84c]",
    bgColor: "bg-[#c9a84c]/10",
  },
  {
    label: "구인/구직",
    href: "/admin/content/jobs",
    icon: Briefcase,
    description: "구인/구직 게시판 관리",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
];

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">콘텐츠 관리</h1>
        <p className="text-sm text-gray-400 mt-1">
          공개 페이지에 표시되는 콘텐츠를 관리합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contentTypes.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] hover:border-[#c9a84c]/20 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-[#c9a84c] transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
