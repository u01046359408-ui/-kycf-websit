"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Payment } from "@/types";

// 결제 상태별 스타일
const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  completed: {
    label: "결제완료",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  pending: {
    label: "대기중",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  failed: {
    label: "실패",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  refunded: {
    label: "환불완료",
    className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  },
};

interface PaymentWithTemplate extends Payment {
  template?: { name: string };
}

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<PaymentWithTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("payments")
          .select(
            "*, template:certificate_templates!payments_certificate_template_id_fkey(name)"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setPayments(data ?? []);
      } catch (err) {
        console.error("결제 내역 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [supabase]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-bold text-white">결제 내역</h3>
        <p className="text-sm text-gray-400 mt-1">
          총 {payments.length}건의 결제 기록이 있습니다.
        </p>
      </div>

      {payments.length > 0 ? (
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
                    증명서
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    결제수단
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    결제일
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment) => {
                  const statusConfig =
                    STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.pending;

                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-mono">
                        {payment.order_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {payment.template?.name ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-white text-right font-medium">
                        {payment.amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {payment.method ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.className}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 */}
          <div className="sm:hidden divide-y divide-white/5">
            {payments.map((payment) => {
              const statusConfig =
                STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.pending;

              return (
                <div key={payment.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {payment.template?.name ?? "-"}
                      </p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {payment.order_id}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.className}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">
                      {payment.amount.toLocaleString()}원
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(payment.created_at)}
                      {payment.method && ` | ${payment.method}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="p-12 text-center">
          <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">결제 내역이 없습니다.</p>
          <p className="text-sm text-gray-500 mt-1">
            증명서를 발급받으면 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
