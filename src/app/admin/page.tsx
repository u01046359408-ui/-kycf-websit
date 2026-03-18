"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";
import type { DashboardStats } from "@/types";

// 통계 카드 설정
const statCards = [
  {
    key: "totalUsers" as const,
    label: "총 회원수",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    suffix: "명",
  },
  {
    key: "totalPayments" as const,
    label: "총 결제건수",
    icon: CreditCard,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    suffix: "건",
  },
  {
    key: "totalRevenue" as const,
    label: "총 매출액",
    icon: TrendingUp,
    color: "from-[#c9a84c] to-[#d4b85c]",
    bgColor: "bg-[#c9a84c]/10",
    textColor: "text-[#c9a84c]",
    suffix: "원",
    format: true,
  },
  {
    key: "totalCertificates" as const,
    label: "총 발급건수",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    suffix: "건",
  },
];

// 결제 상태 뱃지
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    refunded: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  const labels: Record<string, string> = {
    completed: "완료",
    pending: "대기",
    failed: "실패",
    refunded: "환불",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] ?? styles.pending}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("통계 데이터를 불러올 수 없습니다.");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "데이터를 불러올 수 없습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded w-20 mb-4" />
              <div className="h-8 bg-white/10 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="text-sm text-gray-400 mt-1">
          서비스 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats?.[card.key] ?? 0;
          const displayValue = card.format
            ? value.toLocaleString()
            : value.toLocaleString();

          return (
            <div
              key={card.key}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">{card.label}</span>
                <div
                  className={`w-10 h-10 ${card.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {displayValue}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  {card.suffix}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* 최근 7일 통계 요약 */}
      {stats?.weeklyStats && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">최근 7일 요약</h3>
              <p className="text-sm text-gray-400 mt-0.5">
                지난 7일간의 활동 현황
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5">
            <div className="p-6 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                신규 가입
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {stats.weeklyStats.newUsers}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  명
                </span>
              </p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                결제 건수
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {stats.weeklyStats.payments}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  건
                </span>
              </p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                매출액
              </p>
              <p className="text-2xl font-bold text-[#c9a84c]">
                {stats.weeklyStats.revenue.toLocaleString()}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  원
                </span>
              </p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                증명서 발급
              </p>
              <p className="text-2xl font-bold text-purple-400">
                {stats.weeklyStats.certificates}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  건
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 최근 결제 목록 */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">최근 결제</h3>
            <p className="text-sm text-gray-400 mt-1">최근 5건의 결제 내역</p>
          </div>
          <a
            href="/admin/payments"
            className="flex items-center gap-1 text-sm text-[#c9a84c] hover:text-[#d4b85c] transition-colors"
          >
            전체 보기
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {stats?.recentPayments && stats.recentPayments.length > 0 ? (
          <>
            {/* 데스크톱 테이블 */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      주문번호
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      사용자
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      증명서
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      금액
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-mono">
                        {payment.order_id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">
                          {(payment.profile as { name?: string })?.name ?? "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(payment.profile as { email?: string })?.email ?? ""}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {(payment.template as { name?: string })?.name ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-white text-right font-medium">
                        {payment.amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 */}
            <div className="sm:hidden divide-y divide-white/5">
              {stats.recentPayments.map((payment) => (
                <div key={payment.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {(payment.profile as { name?: string })?.name ?? "-"}
                      </p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {payment.order_id}
                      </p>
                    </div>
                    <StatusBadge status={payment.status} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {(payment.template as { name?: string })?.name ?? "-"}
                    </span>
                    <span className="text-sm text-white font-medium">
                      {payment.amount.toLocaleString()}원
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-gray-500">
            결제 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
