"use client";

import { useState, useEffect, useCallback } from "react";
import PageBanner from "@/components/layout/PageBanner";
import type { Announcement } from "@/types";

const categories = ["전체", "연맹공지", "행사공지"] as const;
type Category = (typeof categories)[number];

export default function AnnouncementsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
    });
    if (activeCategory !== "전체") params.set("category", activeCategory);
    if (searchTerm) params.set("search", searchTerm);

    try {
      const res = await fetch(`/api/content/announcements?${params}`);
      const data = await res.json();
      setItems(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, searchTerm]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(searchInput);
  };

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <>
      <PageBanner
        title="공지사항"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "알림마당", href: "/notice" },
          { label: "공지사항", href: "/notice/announcements" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 검색 */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 max-w-md px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 rounded-lg bg-[#c9a84c] text-[#0a1628] font-semibold hover:bg-[#d4b85c] transition-colors"
          >
            검색
          </button>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#c9a84c] text-[#0a1628]"
                  : "bg-[#1a2744] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
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
                  <th className="px-4 py-3 text-center text-gray-400 font-medium w-24">카테고리</th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">제목</th>
                  <th className="px-4 py-3 text-center text-gray-400 font-medium w-28">작성일</th>
                  <th className="px-4 py-3 text-center text-gray-400 font-medium w-20">조회수</th>
                </tr>
              </thead>
              <tbody>
                {items.map((notice) => (
                  <tr
                    key={notice.id}
                    className="border-b border-white/5 hover:bg-[#1a2744]/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/notice/announcements/${notice.id}`}
                  >
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notice.category === "연맹공지"
                            ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                            : "bg-blue-500/15 text-blue-400"
                        }`}
                      >
                        {notice.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white hover:text-[#c9a84c] transition-colors">
                      {notice.title}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">
                      {new Date(notice.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">{notice.views}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                      {searchTerm ? "검색 결과가 없습니다." : "등록된 공지사항이 없습니다."}
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
