"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Shield, User } from "lucide-react";
import type { Profile } from "@/types";

interface UsersResponse {
  users: Profile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("회원 목록을 불러올 수 없습니다.");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("회원 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 검색 디바운스
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 역할 변경
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (
      !confirm(
        `해당 회원의 역할을 "${newRole === "admin" ? "관리자" : "일반회원"}"(으)로 변경하시겠습니까?`
      )
    ) {
      return;
    }

    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("역할 변경에 실패했습니다.");
      await fetchUsers();
    } catch (err) {
      console.error("역할 변경 실패:", err);
      alert("역할 변경에 실패했습니다.");
    } finally {
      setUpdatingId(null);
    }
  };

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
        <h1 className="text-2xl font-bold text-white">회원 관리</h1>
        <p className="text-sm text-gray-400 mt-1">
          전체 회원 목록을 관리합니다.
        </p>
      </div>

      {/* 검색바 */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="이름 또는 이메일로 검색..."
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
        ) : data && data.users.length > 0 ? (
          <>
            {/* 데스크톱 테이블 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      이름
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      이메일
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      가입일
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      역할
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#c9a84c]/30 to-[#c9a84c]/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-[#c9a84c]">
                              {user.name?.charAt(0) ?? "?"}
                            </span>
                          </div>
                          <span className="text-sm text-white font-medium">
                            {user.name ?? "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                            <Shield className="w-3 h-3" />
                            관리자
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <User className="w-3 h-3" />
                            일반회원
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            handleRoleChange(
                              user.id,
                              user.role === "admin" ? "user" : "admin"
                            )
                          }
                          disabled={updatingId === user.id}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/10"
                        >
                          {updatingId === user.id
                            ? "변경 중..."
                            : user.role === "admin"
                              ? "일반회원으로"
                              : "관리자로"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 */}
            <div className="md:hidden divide-y divide-white/5">
              {data.users.map((user) => (
                <div key={user.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#c9a84c]/30 to-[#c9a84c]/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-[#c9a84c]">
                          {user.name?.charAt(0) ?? "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">
                          {user.name ?? "-"}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                        <Shield className="w-3 h-3" />
                        관리자
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <User className="w-3 h-3" />
                        일반
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      가입일: {formatDate(user.created_at)}
                    </span>
                    <button
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          user.role === "admin" ? "user" : "admin"
                        )
                      }
                      disabled={updatingId === user.id}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-50 transition-all border border-white/10"
                    >
                      {updatingId === user.id
                        ? "변경 중..."
                        : user.role === "admin"
                          ? "일반회원으로"
                          : "관리자로"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <span className="text-sm text-gray-400">
                  총 {data.total}명 중 {(data.page - 1) * data.limit + 1}-
                  {Math.min(data.page * data.limit, data.total)}명
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
            {search ? "검색 결과가 없습니다." : "회원이 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
}
