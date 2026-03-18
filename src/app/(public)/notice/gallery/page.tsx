"use client";

import { useState, useEffect, useCallback } from "react";
import PageBanner from "@/components/layout/PageBanner";
import type { GalleryItem } from "@/types";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content/gallery?page=${page}&limit=12`);
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
        title="사진자료실"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "알림마당", href: "/notice" },
          { label: "사진자료실", href: "/notice/gallery" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            등록된 사진이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#c9a84c]/30 transition-all duration-300 cursor-pointer"
              >
                {/* 이미지 */}
                <div className="relative aspect-[4/3] bg-[#1a2744] flex flex-col items-center justify-center gap-2 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-12 h-12 text-gray-600 group-hover:text-[#c9a84c]/50 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                        />
                      </svg>
                      <span className="text-xs text-gray-600">사진</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-[#c9a84c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* 정보 */}
                <div className="p-4">
                  <h3 className="text-white font-medium text-sm sm:text-base leading-snug group-hover:text-[#c9a84c] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
            ))}
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
