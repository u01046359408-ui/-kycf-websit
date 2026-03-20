"use client";

import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X, RotateCcw } from "lucide-react";

interface PageEditableWrapperProps {
  pageKey: string;
  children: React.ReactNode;
}

export default function PageEditableWrapper({ pageKey, children }: PageEditableWrapperProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const contentRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedHtml, setSavedHtml] = useState<string | null>(null);
  const [originalHtml, setOriginalHtml] = useState<string>("");

  // DB에서 저장된 HTML 로드
  useEffect(() => {
    fetch(`/api/page-content/${pageKey}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.metadata?.html) {
          setSavedHtml(data.metadata.html);
        }
      })
      .catch(() => {});
  }, [pageKey]);

  const startEdit = () => {
    // 편집 시작 전 현재 HTML 백업
    if (contentRef.current) {
      setOriginalHtml(contentRef.current.innerHTML);
    }
    setEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => {
    // 편집 취소 시 원래 HTML 복원
    if (contentRef.current && originalHtml) {
      contentRef.current.innerHTML = originalHtml;
    }
    setEditing(false);
  };

  const saveEdit = async () => {
    if (!contentRef.current) return;
    setSaving(true);
    try {
      const html = contentRef.current.innerHTML;
      const res = await fetch(`/api/page-content/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: pageKey,
          metadata: { html },
        }),
      });
      if (res.ok) {
        setSavedHtml(html);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    if (!confirm("기본 디자인으로 초기화하시겠습니까? 수정한 내용이 모두 사라집니다.")) return;
    try {
      const res = await fetch(`/api/page-content/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: pageKey,
          metadata: {},
        }),
      });
      if (res.ok) {
        setSavedHtml(null);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("초기화에 실패했습니다.");
    }
  };

  if (!isAdmin) {
    // 일반 사용자: 저장된 HTML이 있으면 표시, 없으면 기본 디자인
    return savedHtml ? (
      <div dangerouslySetInnerHTML={{ __html: savedHtml }} />
    ) : (
      <>{children}</>
    );
  }

  return (
    <>
      {/* 관리자 툴바 */}
      <div className="sticky top-20 z-50 mb-6">
        <div className="inline-flex items-center gap-3 bg-[#1a2744] border border-white/10 rounded-xl px-4 py-2 shadow-lg">
          {!editing ? (
            <>
              <button
                onClick={startEdit}
                className="flex items-center gap-2 px-4 py-2 bg-[#C5963A] text-white text-sm font-medium rounded-lg hover:bg-[#B08530] transition-colors"
              >
                <Pencil className="w-4 h-4" />
                이 페이지 수정
              </button>
              {savedHtml && (
                <button
                  onClick={resetToDefault}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 text-sm hover:text-white transition-colors"
                  title="기본 디자인으로 초기화"
                >
                  <RotateCcw className="w-4 h-4" />
                  초기화
                </button>
              )}
              {saved && (
                <span className="text-green-400 text-sm">저장되었습니다!</span>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[#C5963A] text-sm font-medium">
                <Pencil className="w-4 h-4" />
                편집 중 — 텍스트를 클릭하여 수정하세요
              </div>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#2B5BA8] text-white text-sm font-medium rounded-lg hover:bg-[#1E4A8F] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 text-sm hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                취소
              </button>
            </>
          )}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div
        ref={contentRef}
        contentEditable={editing}
        suppressContentEditableWarning
        className={
          editing
            ? "outline-none [&_p]:hover:outline-dashed [&_p]:hover:outline-1 [&_p]:hover:outline-[#c9a84c]/40 [&_h2]:hover:outline-dashed [&_h2]:hover:outline-1 [&_h2]:hover:outline-[#c9a84c]/40 [&_h3]:hover:outline-dashed [&_h3]:hover:outline-1 [&_h3]:hover:outline-[#c9a84c]/40 [&_h4]:hover:outline-dashed [&_h4]:hover:outline-1 [&_h4]:hover:outline-[#c9a84c]/40 [&_span]:hover:outline-dashed [&_span]:hover:outline-1 [&_span]:hover:outline-[#c9a84c]/40 [&_td]:hover:outline-dashed [&_td]:hover:outline-1 [&_td]:hover:outline-[#c9a84c]/40 [&_li]:hover:outline-dashed [&_li]:hover:outline-1 [&_li]:hover:outline-[#c9a84c]/40 cursor-text rounded-lg"
            : ""
        }
      >
        {savedHtml && !editing ? (
          <div dangerouslySetInnerHTML={{ __html: savedHtml }} />
        ) : (
          children
        )}
      </div>
    </>
  );
}
