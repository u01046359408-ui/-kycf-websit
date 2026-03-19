"use client";

import { useState, useEffect } from "react";
import { FileText, Save, X, CheckCircle, Loader2 } from "lucide-react";

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  updated_at: string;
}

const PAGE_LABELS: Record<string, string> = {
  greeting: "인사말",
  history: "연혁",
  vision: "비전 및 목표",
  business: "주요사업",
  organization: "조직도",
  location: "오시는길",
  regulations: "규정",
  disclosure: "경영공시",
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/page-contents");
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page: PageContent) => {
    setEditingKey(page.page_key);
    setEditTitle(page.title);
    setEditContent(page.content);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleSave = async () => {
    if (!editingKey) return;
    setSaving(true);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/page-content/${editingKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPages((prev) =>
          prev.map((p) => (p.page_key === editingKey ? updated : p))
        );
        setSuccessMessage("저장되었습니다.");
        setTimeout(() => {
          setEditingKey(null);
          setSuccessMessage(null);
        }, 1500);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FileText className="w-7 h-7 text-[#c9a84c]" />
          페이지 콘텐츠 관리
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          소개 페이지의 내용을 수정합니다
        </p>
      </div>

      {/* Page list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.map((page) => (
          <div
            key={page.page_key}
            className="bg-[#111827] border border-white/10 rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors duration-200"
          >
            {editingKey === page.page_key ? (
              /* Edit form */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    제목
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    내용
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg text-white text-sm min-h-[300px] resize-y focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30"
                  />
                </div>

                {successMessage && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {successMessage}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] hover:bg-[#d4b85c] text-[#0a1628] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                </div>
              </div>
            ) : (
              /* Card view */
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base">
                    {PAGE_LABELS[page.page_key] || page.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    키: {page.page_key}
                  </p>
                  <p className="text-gray-400 text-xs mt-2 truncate">
                    {page.content
                      ? page.content.substring(0, 80) + (page.content.length > 80 ? "..." : "")
                      : "(내용 없음)"}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    최종 수정: {formatDate(page.updated_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(page)}
                  className="ml-4 px-4 py-2 bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 hover:bg-[#c9a84c]/20 rounded-lg text-sm font-medium transition-colors shrink-0"
                >
                  수정
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">등록된 페이지가 없습니다.</p>
          <p className="text-gray-500 text-sm mt-1">
            Supabase에서 page_contents 테이블을 생성해 주세요.
          </p>
        </div>
      )}
    </div>
  );
}
