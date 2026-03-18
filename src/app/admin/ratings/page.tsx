"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { PlayerRating } from "@/types";

const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "대전", "광주",
  "울산", "세종", "강원", "충북", "충남", "전북", "전남",
  "경북", "경남", "제주",
];

const EMPTY_FORM = {
  member_code: "",
  name: "",
  region: "",
  rating: 1000,
  grade: "",
  birth_date: "",
  gender: "",
  organization: "",
  wins: 0,
  losses: 0,
  draws: 0,
  last_competition: "",
  last_competition_date: "",
  user_id: "",
  is_active: true,
};

function getRatingColor(rating: number) {
  if (rating >= 2000) return "text-[#c9a84c]";
  if (rating >= 1500) return "text-blue-400";
  if (rating >= 1000) return "text-green-400";
  return "text-gray-400";
}

function getRatingBadge(rating: number) {
  if (rating >= 2000) return "bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30";
  if (rating >= 1500) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  if (rating >= 1000) return "bg-green-500/20 text-green-400 border-green-500/30";
  return "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export default function AdminRatingsPage() {
  const [ratings, setRatings] = useState<PlayerRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState("rating_desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 모달
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // 회원 검색 (프로필 연결용)
  const [profileSearch, setProfileSearch] = useState("");
  const [profiles, setProfiles] = useState<{ id: string; name: string; email: string }[]>([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const fetchRatings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        sort,
        showAll: "true",
      });
      if (search) params.set("search", search);
      if (region) params.set("region", region);

      const res = await fetch(`/api/admin/ratings?${params}`);
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

  // 프로필 검색
  useEffect(() => {
    if (!profileSearch || profileSearch.length < 2) {
      setProfiles([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/users?search=${encodeURIComponent(profileSearch)}&limit=10`);
        const json = await res.json();
        if (res.ok && json.users) {
          setProfiles(json.users.map((u: { id: string; name: string; email: string }) => ({
            id: u.id,
            name: u.name,
            email: u.email,
          })));
          setShowProfileDropdown(true);
        }
      } catch {
        // ignore
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [profileSearch]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setProfileSearch("");
    setShowModal(true);
  };

  const openEdit = (r: PlayerRating) => {
    setEditingId(r.id);
    setForm({
      member_code: r.member_code,
      name: r.name,
      region: r.region,
      rating: r.rating,
      grade: r.grade,
      birth_date: r.birth_date || "",
      gender: r.gender,
      organization: r.organization,
      wins: r.wins,
      losses: r.losses,
      draws: r.draws,
      last_competition: r.last_competition,
      last_competition_date: r.last_competition_date || "",
      user_id: r.user_id || "",
      is_active: r.is_active,
    });
    setFormError("");
    setProfileSearch("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFormError("성명은 필수 항목입니다.");
      return;
    }
    setSaving(true);
    setFormError("");

    try {
      const payload = {
        ...form,
        rating: Number(form.rating),
        wins: Number(form.wins),
        losses: Number(form.losses),
        draws: Number(form.draws),
        birth_date: form.birth_date || null,
        last_competition_date: form.last_competition_date || null,
        user_id: form.user_id || null,
      };

      const url = editingId
        ? `/api/admin/ratings/${editingId}`
        : "/api/admin/ratings";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormError(json.error || "저장에 실패했습니다.");
        return;
      }

      setShowModal(false);
      fetchRatings();
    } catch {
      setFormError("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 선수를 삭제하시겠습니까?`)) return;

    try {
      const res = await fetch(`/api/admin/ratings/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRatings();
      } else {
        const json = await res.json();
        alert(json.error || "삭제에 실패했습니다.");
      }
    } catch {
      alert("서버 오류가 발생했습니다.");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRatings();
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">레이팅 및 선수명단 관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            총 {total}명의 선수가 등록되어 있습니다.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] hover:bg-[#d4b85c] text-[#0a1628] font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 선수 등록
        </button>
      </div>

      {/* 필터 바 */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 bg-[#0d1425] border border-white/5 rounded-xl p-4">
        <select
          value={region}
          onChange={(e) => { setRegion(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-[#0a0e1a] border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#c9a84c]/50"
        >
          <option value="">전체 지역</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 회원코드 검색..."
            className="w-full pl-10 pr-4 py-2 bg-[#0a0e1a] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-[#0a0e1a] border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#c9a84c]/50"
        >
          <option value="rating_desc">레이팅 높은순</option>
          <option value="rating_asc">레이팅 낮은순</option>
          <option value="name">이름순</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
        >
          검색
        </button>
      </form>

      {/* 테이블 */}
      <div className="bg-[#0d1425] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">순위</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">회원코드</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">성명</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">지역</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">레이팅</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">등급</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">전적</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">최근대회</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">상태</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
                      로딩 중...
                    </div>
                  </td>
                </tr>
              ) : ratings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                    등록된 선수가 없습니다.
                  </td>
                </tr>
              ) : (
                ratings.map((r, idx) => (
                  <tr
                    key={r.id}
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                      !r.is_active ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-300 font-mono">
                      {(page - 1) * 20 + idx + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                      {r.member_code}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-gray-300">{r.region || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold ${getRatingBadge(r.rating)}`}>
                        {r.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{r.grade || "-"}</td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      <span className="text-green-400">{r.wins}승</span>
                      {" / "}
                      <span className="text-red-400">{r.losses}패</span>
                      {" / "}
                      <span className="text-gray-400">{r.draws}무</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[150px] truncate">
                      {r.last_competition || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                        r.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {r.is_active ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(r)}
                          className="p-1.5 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-lg transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.name)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-white/5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 등록/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0d1425] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "선수 정보 수정" : "새 선수 등록"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="p-6 space-y-5">
              {formError && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                  {formError}
                </div>
              )}

              {/* 회원코드 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  회원코드 <span className="text-gray-500 font-normal">(비워두면 자동생성)</span>
                </label>
                <input
                  type="text"
                  value={form.member_code}
                  onChange={(e) => setForm({ ...form, member_code: e.target.value })}
                  placeholder="KYCF-XXXXXX"
                  className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>

              {/* 성명 + 지역 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    성명 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c9a84c]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">지역</label>
                  <select
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c9a84c]/50"
                  >
                    <option value="">선택</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 레이팅 + 등급 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">레이팅</label>
                  <input
                    type="number"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c9a84c]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">등급</label>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    placeholder="예: 1급, 2급, 초단..."
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
                  />
                </div>
              </div>

              {/* 생년월일 + 성별 + 소속 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">생년월일</label>
                  <input
                    type="date"
                    value={form.birth_date}
                    onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c9a84c]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">성별</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c9a84c]/50"
                  >
                    <option value="">선택</option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">소속</label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
                  />
                </div>
              </div>

              {/* 전적: 승/패/무 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">전적</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">승</label>
                    <input
                      type="number"
                      min={0}
                      value={form.wins}
                      onChange={(e) => setForm({ ...form, wins: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-green-400 focus:outline-none focus:border-[#c9a84c]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">패</label>
                    <input
                      type="number"
                      min={0}
                      value={form.losses}
                      onChange={(e) => setForm({ ...form, losses: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-red-400 focus:outline-none focus:border-[#c9a84c]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">무</label>
                    <input
                      type="number"
                      min={0}
                      value={form.draws}
                      onChange={(e) => setForm({ ...form, draws: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-gray-400 focus:outline-none focus:border-[#c9a84c]/50"
                    />
                  </div>
                </div>
              </div>

              {/* 최근대회 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">최근대회명</label>
                  <input
                    type="text"
                    value={form.last_competition}
                    onChange={(e) => setForm({ ...form, last_competition: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">최근대회일자</label>
                  <input
                    type="date"
                    value={form.last_competition_date}
                    onChange={(e) => setForm({ ...form, last_competition_date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#c9a84c]/50"
                  />
                </div>
              </div>

              {/* 회원 연결 */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  회원 연결 <span className="text-gray-500 font-normal">(선택)</span>
                </label>
                {form.user_id ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0e1a] border border-[#c9a84c]/30 rounded-lg">
                    <span className="text-sm text-white flex-1">
                      연결된 회원 ID: <span className="text-[#c9a84c] font-mono text-xs">{form.user_id}</span>
                    </span>
                    <button
                      onClick={() => setForm({ ...form, user_id: "" })}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={profileSearch}
                      onChange={(e) => setProfileSearch(e.target.value)}
                      onFocus={() => profiles.length > 0 && setShowProfileDropdown(true)}
                      placeholder="회원 이름 또는 이메일로 검색..."
                      className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
                    />
                    {showProfileDropdown && profiles.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-[#0a0e1a] border border-white/10 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                        {profiles.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setForm({ ...form, user_id: p.id });
                              setProfileSearch("");
                              setShowProfileDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm"
                          >
                            <span className="text-white">{p.name || "이름없음"}</span>
                            <span className="text-gray-500 ml-2">{p.email}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 활성 상태 (수정 시) */}
              {editingId && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-300">활성 상태</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      form.is_active ? "bg-green-500" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        form.is_active ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-400">
                    {form.is_active ? "활성" : "비활성"}
                  </span>
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-[#c9a84c] hover:bg-[#d4b85c] text-[#0a1628] font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saving ? "저장 중..." : editingId ? "수정" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
