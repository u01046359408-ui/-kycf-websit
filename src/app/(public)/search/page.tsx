"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageBanner from "@/components/layout/PageBanner";
import { Search, FileText, Calendar } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "2026 전국 인재발굴 대회 개최 안내",
    excerpt:
      "2026년도 전국 인재발굴 대회를 아래와 같이 개최합니다. 많은 참여 바랍니다. 접수 기간은 3월 1일부터 4월 15일까지입니다...",
    date: "2026-03-15",
    href: "/notice/announcements",
  },
  {
    id: "2",
    title: "지도사 자격 연수 과정 모집 공고",
    excerpt:
      "2026년 상반기 지도사 자격 연수 과정 수강생을 모집합니다. 본 과정은 인재 육성 분야의 전문 지도사를 양성하기 위한 과정으로...",
    date: "2026-03-10",
    href: "/education/instructor",
  },
  {
    id: "3",
    title: "대한인재 비전 2030 발표",
    excerpt:
      "대한인재개발원은 '비전 2030'을 발표하였습니다. 향후 5년간 인재 양성 체계를 혁신하고, 디지털 역량 강화 프로그램을 확대할 계획입니다...",
    date: "2026-02-28",
    href: "/about/vision",
  },
  {
    id: "4",
    title: "심판 자격증 갱신 안내",
    excerpt:
      "심판 자격증 갱신 절차가 변경되었습니다. 2026년부터는 온라인 보수교육 이수 후 갱신이 가능하며, 기존 자격 보유자는...",
    date: "2026-02-20",
    href: "/education/referee",
  },
  {
    id: "5",
    title: "국제 인재교류 프로그램 결과 보고",
    excerpt:
      "2025년 하반기 국제 인재교류 프로그램 참가 결과를 보고드립니다. 총 12개국 150명의 참가자가 교류하였으며...",
    date: "2026-01-15",
    href: "/events/results-international",
  },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = (q: string) => {
    setSearched(true);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const filtered = mockResults.filter(
      (r) =>
        r.title.toLowerCase().includes(q.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(q.toLowerCase())
    );
    setResults(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    performSearch(query.trim());
  };

  return (
    <>
      <PageBanner
        title="검색 결과"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "검색 결과", href: "/search" },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search input */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full h-14 pl-5 pr-14 text-base bg-[#1a2744]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-[#c9a84c] hover:bg-[#d4b85c] text-[#0a1628] transition-colors duration-200"
              aria-label="검색"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Results */}
        {searched && (
          <>
            {initialQuery && (
              <p className="text-sm text-gray-400 mb-6">
                <span className="text-[#c9a84c] font-medium">
                  &ldquo;{initialQuery}&rdquo;
                </span>
                에 대한 검색 결과{" "}
                <span className="text-white font-medium">{results.length}</span>
                건
              </p>
            )}

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    className="block bg-[#1a2744]/60 backdrop-blur-xl border border-white/5 rounded-xl p-5 hover:border-[#c9a84c]/30 hover:bg-[#1a2744]/80 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 w-9 h-9 shrink-0 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#c9a84c]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white group-hover:text-[#c9a84c] transition-colors duration-200 truncate">
                          {result.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-gray-400 leading-relaxed line-clamp-2">
                          {result.excerpt}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {result.date}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-white/5 flex items-center justify-center">
                  <Search className="w-7 h-7 text-gray-500" />
                </div>
                <p className="text-lg font-medium text-gray-300">
                  검색 결과가 없습니다
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  다른 검색어를 입력하거나 검색 범위를 넓혀 보세요.
                </p>
              </div>
            )}
          </>
        )}

        {/* Initial state (no search performed) */}
        {!searched && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
              <Search className="w-7 h-7 text-[#c9a84c]" />
            </div>
            <p className="text-lg font-medium text-gray-300">
              검색어를 입력해 주세요
            </p>
            <p className="mt-2 text-sm text-gray-500">
              공지사항, 행사 일정, 교육 과정 등을 검색할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
