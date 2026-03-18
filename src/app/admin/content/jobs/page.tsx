"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { JobItem } from "@/types";

export default function AdminJobsPage() {
  const [items, setItems] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", content: "", type: "구인" as string, deadline: "", status: "진행중" as string,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/content/jobs?page=${page}&limit=10`);
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

    const url = editingId ? `/api/content/jobs/${editingId}` : "/api/content/jobs";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        deadline: form.deadline || null,
      }),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", content: "", type: "구인", deadline: "", status: "진행중" });
      fetchItems();
    }
  };

  const handleEdit = (item: JobItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title, content: item.content, type: item.type,
      deadline: item.deadline || "", status: item.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/content/jobs/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const togglePublish = async (item: JobItem) => {
    await fetch(`/api/content/jobs/${item.id}`, {
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
          <h1 className="text-2xl font-bold text-white">구인/구직 관리</h1>
          <p className="text-sm text-gray-400 mt-1">구인/구직 게시물을 관리합니다.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ title: "", content: "", type: "구인", deadline: "", status: "진행중" });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a1628] font-semibold text-sm rounded-lg hover:bg-[#d4b85c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 글 등록
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {editingId ? "글 수정" : "새 글 등록"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">제목</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
                placeholder="게시글 제목"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">구분</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white focus:outline-none focus:border-[#c9a84c]/50"
                >
                  <option value="구인">구인</option>
                  <option value="구직">구직</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">마감일</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">상태</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white focus:outline-none focus:border-[#c9a84c]/50"
                >
                  <option value="진행중">진행중</option>
                  <option value="마감">마감</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">내용</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 resize-none"
              placeholder="상세 내용"
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

      {loading ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#111d35] border-b border-white/10">
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-20">구분</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">제목</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-28">마감일</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-20">상태</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-20">공개</th>
                <th className="px-4 py-3 text-center text-gray-400 font-medium w-28">관리</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-[#1a2744]/50 transition-colors">
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === "구인" ? "bg-[#c9a84c]/15 text-[#c9a84c]" : "bg-purple-500/15 text-purple-400"
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white">{item.title}</td>
                  <td className="px-4 py-4 text-center text-gray-500">{item.deadline || "-"}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === "진행중" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.is_published ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"
                    }`}>
                      {item.is_published ? "공개" : "비공개"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => togglePublish(item)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        {item.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-400 hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    등록된 구인/구직 글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                p === page ? "bg-[#c9a84c] text-[#0a1628]" : "text-gray-400 hover:text-white hover:bg-[#1a2744]"
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
