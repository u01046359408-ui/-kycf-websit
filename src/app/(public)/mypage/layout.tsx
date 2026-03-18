"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import {
  User,
  Mail,
  CalendarDays,
  ChevronRight,
  FileText,
  CreditCard,
  UserCircle,
  Lock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// 사이드 탭 아이템
const sidebarTabs = [
  { label: "내 정보", href: "/mypage", icon: UserCircle },
  { label: "비밀번호 변경", href: "/mypage/password", icon: Lock },
  { label: "결제 내역", href: "/mypage/payments", icon: CreditCard },
  { label: "발급 내역", href: "/mypage/certificates", icon: FileText },
];

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  return (
    <>
      <PageBanner
        title="마이페이지"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "마이페이지", href: "/mypage" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 - 사용자 정보 카드 */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-24">
              {loading ? (
                <div className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-white/10 rounded-full" />
                  <div className="h-5 bg-white/10 rounded w-24" />
                  <div className="h-4 bg-white/10 rounded w-16" />
                </div>
              ) : user ? (
                <>
                  {/* 아바타 */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#c9a84c] to-[#d4b85c] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-[#0a1628]">
                      {user.name?.charAt(0) ?? "U"}
                    </span>
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-lg font-bold text-white">
                      {user.name ?? "회원"}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {user.role === "admin" ? "관리자" : "일반 회원"}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <User className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    로그인이 필요합니다.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block mt-3 px-4 py-2 text-sm bg-[#c9a84c] text-[#0a1628] rounded-lg font-medium"
                  >
                    로그인
                  </Link>
                </div>
              )}

              {/* 탭 네비게이션 */}
              <nav aria-label="마이페이지 메뉴" className="mt-6 pt-4 border-t border-white/10 space-y-1">
                {sidebarTabs.map((tab) => {
                  const isActive = pathname === tab.href;
                  const Icon = tab.icon;

                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center justify-between py-2.5 px-3 text-sm rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[#c9a84c]/10 text-[#c9a84c] font-medium"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </Link>
                  );
                })}
              </nav>

              {/* 빠른 링크 */}
              {user && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                  <Link
                    href="/certificate"
                    className="flex items-center justify-between py-2 px-3 text-sm text-gray-400 hover:text-[#c9a84c] transition-colors group rounded-lg hover:bg-white/5"
                  >
                    <span>증명서 발급</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <button
                    onClick={signOut}
                    className="flex items-center justify-between py-2 px-3 text-sm text-gray-400 hover:text-red-400 transition-colors group w-full rounded-lg hover:bg-red-500/5"
                  >
                    <span>로그아웃</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </>
  );
}
