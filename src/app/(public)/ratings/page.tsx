"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, ChevronLeft, ChevronRight, Star, User } from "lucide-react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import type { PlayerRating } from "@/types";

const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "대전", "광주",
  "울산", "세종", "강원", "충북", "충남", "전북", "전남",
  "경북", "경남", "제주",
];

function getRatingBadgeClass(rating: number) {
  if (rating >= 2000) return "bg-amber-100 text-amber-700 border-amber-200";
  if (rating >= 1500) return "bg-blue-100 text-blue-700 border-blue-200";
  if (rating >= 1000) return "bg-green-100 text-green-700 border-green-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

export default function RatingsPage() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<PlayerRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState("rating_desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 내 레이팅
  const [myRating, setMyRating] = useState<PlayerRating | null>(null);
  const myRowRef = useRef<HTMLTableRowElement>(null);
  const myCardRef = useRef<HTMLDivElement>(null);

  const fetchRatings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        sort,
      });
      if (search) params.set("search", search);
      if (region) params.set("region", region);

      const res = await fetch(`/api/ratings?${params}`);
      const json = await res.json();

      if (res.ok) {
        setRatings(json.data);
        setTotalPages(json.totalPages);
        setTotal(json.total);
      }
    } catch (err) {
      console.error("레이팅 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, region, sort]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  // 내 레이팅 조회
  useEffect(() => {
    if (!user) {
      setMyRating(null);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/ratings?search=&limit=1000`);
        const json = await res.json();
        if (res.ok && json.data) {
          const mine = json.data.find((r: PlayerRating) => r.user_id === user.id);
          setMyRating(mine || null);
        }
      } catch {
        // ignore
      }
    })();
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRatings();
  };

  const scrollToMyRow = () => {
    if (myRowRef.current) {
      myRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (myCardRef.current) {
      myCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <PageBanner
        title="레이팅 및 선수명단"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "행사/인재", href: "/events" },
          { label: "레이팅 및 선수명단", href: "/ratings" },
        ]}
      />

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        {/* 내 레이팅 카드 */}
        {myRating && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 sm:p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-0.5">내 레이팅</p>
                  <h3 className="text-lg font-bold text-gray-900">{myRating.name}</h3>
                  <p className="text-sm text-gray-500">{myRating.member_code}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-0.5">레이팅</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm font-bold ${getRatingBadgeClass(myRating.rating)}`}>
                    <Star className="w-3.5 h-3.5 mr-1" />
                    {myRating.rating}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-0.5">등급</p>
                  <p className="text-sm font-semibold text-gray-800">{myRating.grade || "-"}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-0.5">전적</p>
                  <p className="text-sm font-semibold">
                    <span className="text-green-600">{myRating.wins}승</span>
                    {" "}
                    <span className="text-red-600">{myRating.losses}패</span>
                    {" "}
                    <span className="text-gray-500">{myRating.draws}무</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-0.5">지역</p>
                  <p className="text-sm font-semibold text-gray-800">{myRating.region || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 필터 바 */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름 또는 회원코드 검색..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
          <select
            value={region}
            onChange={(e) => { setRegion(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="">전체 지역</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500 bg-white"
          >
            <option value="rating_desc">레이팅 높은순</option>
            <option value="rating_asc">레이팅 낮은순</option>
            <option value="name">이름순</option>
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1B2A4A] hover:bg-[#243557] text-white rounded-lg text-sm font-medium transition-colors"
          >
            검색
          </button>
          {myRating && (
            <button
              type="button"
              onClick={scrollToMyRow}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              내 레이팅
            </button>
          )}
        </form>

        {/* 결과 정보 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            총 <span className="font-semibold text-gray-800">{total}</span>명
          </p>
        </div>

        {/* 데스크탑 테이블 */}
        <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">순위</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">회원코드</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">성명</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">지역</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">레이팅</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">등급</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">전적</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        로딩 중...
                      </div>
                    </td>
                  </tr>
                ) : ratings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-gray-400">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  ratings.map((r, idx) => {
                    const isMyRow = user && r.user_id === user.id;
                    return (
                      <tr
                        key={r.id}
                        ref={isMyRow ? myRowRef : undefined}
                        className={`border-b border-gray-100 transition-colors ${
                          isMyRow
                            ? "bg-blue-50/70 hover:bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3 text-gray-500 font-mono">
                          {(page - 1) * 20 + idx + 1}
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                          {r.member_code}
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-medium">
                          {r.name}
                          {isMyRow && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                              나
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{r.region || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs font-bold ${getRatingBadgeClass(r.rating)}`}>
                            {r.rating}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{r.grade || "-"}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          <span className="text-green-600">{r.wins}승</span>
                          {" / "}
                          <span className="text-red-600">{r.losses}패</span>
                          {" / "}
                          <span className="text-gray-400">{r.draws}무</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 모바일 카드 레이아웃 */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
              로딩 중...
            </div>
          ) : ratings.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              검색 결과가 없습니다.
            </div>
          ) : (
            ratings.map((r, idx) => {
              const isMyRow = user && r.user_id === user.id;
              return (
                <div
                  key={r.id}
                  ref={isMyRow ? myCardRef : undefined}
                  className={`border rounded-xl p-4 ${
                    isMyRow
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono">
                          #{(page - 1) * 20 + idx + 1}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-bold ${getRatingBadgeClass(r.rating)}`}>
                          {r.rating}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mt-1">
                        {r.name}
                        {isMyRow && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                            나
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">{r.member_code}</p>
                    </div>
                    {r.grade && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        {r.grade}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{r.region || "-"}</span>
                    <span className="text-gray-300">|</span>
                    <span>
                      <span className="text-green-600">{r.wins}승</span>
                      {" "}
                      <span className="text-red-600">{r.losses}패</span>
                      {" "}
                      <span className="text-gray-400">{r.draws}무</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-[#1B2A4A] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </>
  );
}
