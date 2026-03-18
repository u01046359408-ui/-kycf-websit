"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { GalleryItem } from "@/types";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", image_url: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/content/gallery?page=${page}&limit=12`);
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
      ? `/api/content/gallery/${editingId}`
      : "/api/content/gallery";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", description: "", image_url: "" });
      fetchItems();
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, image_url: item.image_url || "" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/content/gallery/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const togglePublish = async (item: GalleryItem) => {
    await fetch(`/api/content/gallery/${item.id}`, {
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
          <h1 className="text-2xl font-bold text-white">사진자료실 관리</h1>
          <p className="text-sm text-gray-400 mt-1">갤러리 사진을 등록하고 관리합니다.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ title: "", description: "", image_url: "" });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c] text-[#0a1628] font-semibold text-sm rounded-lg hover:bg-[#d4b85c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 사진 등록
        </button>
      </div>

      {/* 등록/수정 폼 */}
      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {editingId ? "사진 수정" : "새 사진 등록"}
          </h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">제목</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
              placeholder="사진 제목을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">이미지 URL</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50"
              placeholder="이미지 URL을 입력하세요 (Supabase Storage URL)"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">설명</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-[#1a2744] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 resize-none"
              placeholder="사진 설명을 입력하세요"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-[#1a2744] flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.created_at).toLocaleDateString("ko-KR")}
                </p>
                <div className="flex items-center gap-1 mt-3">
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
                  <span className={`ml-auto inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.is_published ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"
                  }`}>
                    {item.is_published ? "공개" : "비공개"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full bg-white/5 border border-white/10 rounded-xl p-12 text-center text-gray-500">
              등록된 사진이 없습니다.
            </div>
          )}
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
