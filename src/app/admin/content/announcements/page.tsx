"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { Announcement } from "@/types";

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", category: "연맹공지" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/content/announcements?page=${page}&limit=10`);
    const data = await res.json();
    setItems(data.data || []);
    setTotalPages(data.pagination?.totalPages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return;

    const url = editingId
      ? `/api/content/announcements/${editingId}`
      : "/api/content/announcements";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", content: "", category: "연맹공지" });
      fetchItems();
    }
  };

  const handleEdit = (item: Announcement) => {
    setEditingId(item.id);
    setForm({ title: item.title, content: item.content, category: item.category });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/content/announcements/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const togglePublish = async (item: Announcement) => {
    await fetch(`/api/content/announcements/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !item.is_published }),
    });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">공지사항 관리</h1>
          <p className="text-sm text-gray-400 mt-1">공지사항을 등록하고 관리합니다.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ title: "", content: "", category: "연맹공지" });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a1628] font-semibold text-sm rounded-lg hover:bg-[#d4b85c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 공지 등록
        </button>
      </div>

      {/* 등록/수정 폼 */}
      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {editingId ? "공지 수정" : "새 공지 등록"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-sm text-gray-400 mb-1">제목</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
                placeholder="공지 제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">카테고리</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white focus:outline-none focus:border-[#c9a84c]/50"
              >
                <option value="연맹공지">연맹공지</option>
                <option value="행사공지">행사공지</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">내용</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 resize-none"
              placeholder="공지 내용을 입력하세요"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-[#c9a84c] text-[#0a1628] font-semibold text-sm rounded-lg hover:bg-[#d4b85c] transition-colors"
            >
              {editingId ? "수정" : "등록"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="px-6 py-2.5 border border-white/10 text-gray-400 text-sm rounded-lg hover:text-white hover:bg-white/5 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 목록 */}
      {loading ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#111d35] border-b border-white/10">
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-24">카테고리</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">제목</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-20">조회수</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-28">작성일</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-20">상태</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-28">관리</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-[#1a2744]/50 transition-colors">
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.category === "연맹공지"
                        ? "bg-[#c9a84c]/15 text-[#c9a84c]"
                        : "bg-blue-500/15 text-blue-400"
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white">{item.title}</td>
                  <td className="px-4 py-4 text-center text-gray-500">{item.views}</td>
                  <td className="px-4 py-4 text-center text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.is_published
                        ? "bg-green-500/15 text-green-400"
                        : "bg-gray-500/15 text-gray-400"
                    }`}>
                      {item.is_published ? "공개" : "비공개"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => togglePublish(item)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title={item.is_published ? "비공개" : "공개"}
                      >
                        {item.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1">
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
        </div>
      )}
    </div>
  );
}
