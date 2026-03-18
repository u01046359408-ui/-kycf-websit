"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Newspaper,
  LogOut,
  Menu,
  ChevronRight,
  Shield,
  Settings,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// 사이드바 네비게이션 아이템
const sidebarItems = [
  {
    label: "대시보드",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "회원 관리",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "결제 관리",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "증명서 관리",
    href: "/admin/certificates",
    icon: FileText,
  },
  {
    label: "콘텐츠 관리",
    href: "/admin/content",
    icon: Newspaper,
  },
  {
    label: "템플릿 관리",
    href: "/admin/templates",
    icon: Settings,
  },
  {
    label: "회원 기록 관리",
    href: "/admin/records",
    icon: ClipboardList,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 비로그인 또는 관리자가 아닌 경우 리다이렉트
  if (!user || user.role !== "admin") {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        aria-label="관리자 사이드바"
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d1425] border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 로고 */}
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#c9a84c] to-[#d4b85c] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#0a1628]" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">대한인재</span>
              <span className="block text-xs text-[#c9a84c]">관리자</span>
            </div>
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav aria-label="관리자 메뉴" className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 하단 관리자 정보 */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#c9a84c] to-[#d4b85c] rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-[#0a1628]">
                {user.name?.charAt(0) ?? "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name ?? "관리자"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            aria-label="로그아웃"
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 mt-1"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* 상단 헤더 */}
        <header className="sticky top-0 z-30 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-6 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden lg:block">
              <h2 className="text-sm font-medium text-gray-400">
                관리자 패널
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                사이트 보기
              </Link>
            </div>
          </div>
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
