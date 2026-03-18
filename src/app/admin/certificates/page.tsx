"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Certificate } from "@/types";

interface CertificateWithTemplate extends Certificate {
  template?: { name: string; type: string };
}

interface CertificatesResponse {
  certificates: CertificateWithTemplate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminCertificatesPage() {
  const [data, setData] = useState<CertificatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/certificates?${params}`);
      if (!res.ok) throw new Error("증명서 목록을 불러올 수 없습니다.");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("증명서 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // 검색 디바운스
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold text-white">증명서 관리</h1>
        <p className="text-sm text-gray-400 mt-1">
          발급된 증명서 목록을 관리합니다.
        </p>
      </div>

      {/* 검색바 */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="일련번호 또는 신청자명으로 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all"
        />
      </div>

      {/* 테이블 */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : data && data.certificates.length > 0 ? (
          <>
            {/* 데스크톱 테이블 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      일련번호
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      신청자
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      증명서 종류
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      용도
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      발급일
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.certificates.map((cert) => (
                    <tr
                      key={cert.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-mono">
                        {cert.serial_number}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">
                          {cert.applicant_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cert.applicant_phone}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                          {cert.template?.name ?? "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {cert.purpose}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(cert.issued_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 */}
            <div className="md:hidden divide-y divide-white/5">
              {data.certificates.map((cert) => (
                <div key={cert.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {cert.applicant_name}
                      </p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        {cert.serial_number}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                      {cert.template?.name ?? "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {cert.purpose}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(cert.issued_at)}
                    </span>
                  </div>
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
            {search ? "검색 결과가 없습니다." : "발급된 증명서가 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
}
