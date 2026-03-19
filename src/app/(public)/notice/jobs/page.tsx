"use client";

import { useState, useEffect, useCallback } from "react";
import PageBanner from "@/components/layout/PageBanner";
import type { JobItem } from "@/types";

export default function JobsPage() {
  const [items, setItems] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/jobs?page=${page}&limit=10`);
      const data = await res.json();
      setItems(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <>
      <PageBanner
        title="구인/구직"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "알림마당", href: "/notice" },
          { label: "구인/구직", href: "/notice/jobs" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 안내 박스 */}
        <div className="rounded-xl bg-[#111d35] border border-[#c9a84c]/20 p-5 mb-8">
          <p className="text-gray-300 text-sm leading-relaxed">
            한국유소년체스연맹 회원 및 관련 기관을 위한 구인/구직 게시판입니다.
            채용 및 구직 등록을 원하시는 분은 사무국(02-1234-5678)으로 문의해 주세요.
          </p>
        </div>

        {/* 테이블 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#111d35] border-b border-white/10">
                  <th className="px-4 py-3 text-center text-gray-400 font-medium w-20">구분</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">제목</th>
                  <th className="px-4 py-3 text-center text-gray-400 font-medium w-28">등록일</th>
                  <th className="px-4 py-3 text-center text-gray-400 font-medium w-28">마감일</th>
                  <th className="px-4 py-3 text-center text-gray-400 font-medium w-20">상태</th>
                </tr>
              </thead>
              <tbody>
                {items.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-white/5 hover:bg-[#1a2744]/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.type === "구인"
                            ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                            : "bg-purple-500/15 text-purple-400"
                        }`}
                      >
                        {job.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white hover:text-[#c9a84c] transition-colors">
                      {job.title}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">
                      {new Date(job.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">
                      {job.deadline || "-"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === "진행중"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                      등록된 구인/구직 정보가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a2744] transition-colors disabled:opacity-50"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-[#c9a84c] text-[#0a1628]"
                    : "text-gray-400 hover:text-white hover:bg-[#1a2744]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a2744] transition-colors disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </>
  );
}
