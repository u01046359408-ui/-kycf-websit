"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import type { Payment } from "@/types";

// 결제 상태 한글 매핑
const STATUS_LABELS: Record<string, string> = {
  completed: "완료",
  pending: "대기",
  failed: "실패",
  refunded: "환불",
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

// 필터 탭
const FILTER_TABS = [
  { key: "all", label: "전체" },
  { key: "completed", label: "완료" },
  { key: "failed", label: "실패" },
  { key: "refunded", label: "환불" },
];

interface PaymentWithRelations extends Payment {
  profile?: { name: string | null; email: string };
  template?: { name: string };
}

interface PaymentsResponse {
  payments: PaymentWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminPaymentsPage() {
  const [data, setData] = useState<PaymentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/payments?${params}`);
      if (!res.ok) throw new Error("결제 목록을 불러올 수 없습니다.");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("결제 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // 필터 변경 시 페이지 리셋
  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setPage(1);
  };

  // 환불 처리
  const handleRefund = async (paymentId: string) => {
    if (!confirm("정말 환불 처리하시겠습니까?")) return;

    setRefundingId(paymentId);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: "POST",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "환불 처리에 실패했습니다.");
      }

      await fetchPayments();
    } catch (err) {
      console.error("환불 처리 실패:", err);
      alert(
        err instanceof Error ? err.message : "환불 처리에 실패했습니다."
      );
    } finally {
      setRefundingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold text-white">결제 관리</h1>
        <p className="text-sm text-gray-400 mt-1">
          전체 결제 내역을 관리합니다.
        </p>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 max-w-md">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === tab.key
                ? "bg-[#c9a84c] text-[#0a1628]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : data && data.payments.length > 0 ? (
          <>
            {/* 데스크톱 테이블 */}
            <div className="hidden md:block overflow-x-auto">
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
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      일시
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-mono">
                        {payment.order_id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">
                          {payment.profile?.name ?? "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.profile?.email ?? ""}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {payment.template?.name ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-white text-right font-medium">
                        {payment.amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[payment.status] ?? ""}`}
                        >
                          {STATUS_LABELS[payment.status] ?? payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {payment.status === "completed" && (
                          <button
                            onClick={() => handleRefund(payment.id)}
                            disabled={refundingId === payment.id}
                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-red-500/20"
                          >
                            <RotateCcw className="w-3 h-3" />
                            {refundingId === payment.id
                              ? "처리 중..."
                              : "환불"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 */}
            <div className="md:hidden divide-y divide-white/5">
              {data.payments.map((payment) => (
                <div key={payment.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {payment.profile?.name ?? "-"}
                      </p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {payment.order_id}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[payment.status] ?? ""}`}
                    >
                      {STATUS_LABELS[payment.status] ?? payment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400">
                        {payment.template?.name ?? "-"}
                      </span>
                      <span className="text-xs text-gray-600 mx-2">|</span>
                      <span className="text-xs text-gray-400">
                        {formatDate(payment.created_at)}
                      </span>
                    </div>
                    <span className="text-sm text-white font-medium">
                      {payment.amount.toLocaleString()}원
                    </span>
                  </div>
                  {payment.status === "completed" && (
                    <button
                      onClick={() => handleRefund(payment.id)}
                      disabled={refundingId === payment.id}
                      className="w-full flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-all border border-red-500/20"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {refundingId === payment.id ? "처리 중..." : "환불"}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <span className="text-sm text-gray-400">
                  총 {data.total}건 중 {(data.page - 1) * data.limit + 1}-
                  {Math.min(data.page * data.limit, data.total)}건
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-300">
                    {data.page} / {data.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(data.totalPages, p + 1))
                    }
                    disabled={page === data.totalPages}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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
