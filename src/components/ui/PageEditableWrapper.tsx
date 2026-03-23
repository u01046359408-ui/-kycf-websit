"use client";

import { useRef, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Save, X, RotateCcw, Palette, Bold, Italic, Underline } from "lucide-react";

interface PageEditableWrapperProps {
  pageKey: string;
  children: React.ReactNode;
}

export default function PageEditableWrapper({ pageKey, children }: PageEditableWrapperProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  // 가벼운 관리자 체크 (useAuth 대신 직접 세션만 확인)
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          setIsAdmin(profile?.role === "admin");
        }
      } catch {
        // 무시
      }
    };
    checkAdmin();
  }, []);
  const contentRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedHtml, setSavedHtml] = useState<string | null>(null);
  const [originalHtml, setOriginalHtml] = useState<string>("");
  const [showColors, setShowColors] = useState(false);

  const COLORS = [
    { label: "검정", value: "#000000" },
    { label: "빨강", value: "#DC2626" },
    { label: "파랑", value: "#2563EB" },
    { label: "초록", value: "#16A34A" },
    { label: "주황", value: "#EA580C" },
    { label: "보라", value: "#9333EA" },
    { label: "갈색", value: "#92400E" },
    { label: "금색", value: "#C5963A" },
    { label: "네이비", value: "#1B2A4A" },
    { label: "회색", value: "#6B7280" },
  ];

  // 선택한 텍스트에 색상 적용
  const applyColor = (color: string) => {
    document.execCommand("foreColor", false, color);
    setShowColors(false);
    contentRef.current?.focus();
  };

  // 서식 적용 (굵게, 기울임, 밑줄)
  const applyFormat = (command: string) => {
    document.execCommand(command, false);
    contentRef.current?.focus();
  };

  // DB에서 저장된 HTML 로드 (캐시 방지)
  useEffect(() => {
    fetch(`/api/page-content/${pageKey}`, { cache: "no-store" })
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
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error || "저장에 실패했습니다. 다시 로그인 후 시도해 주세요.");
      }
    } catch {
      alert("저장에 실패했습니다. 네트워크 연결을 확인해 주세요.");
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
                편집 중
              </div>

              {/* 구분선 */}
              <div className="w-px h-6 bg-white/20" />

              {/* 서식 버튼 */}
              <button
                onClick={() => applyFormat("bold")}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="굵게"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormat("italic")}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="기울임"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormat("underline")}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="밑줄"
              >
                <Underline className="w-4 h-4" />
              </button>

              {/* 구분선 */}
              <div className="w-px h-6 bg-white/20" />

              {/* 색상 선택 */}
              <div className="relative">
                <button
                  onClick={() => setShowColors(!showColors)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors text-sm"
                  title="글자 색상"
                >
                  <Palette className="w-4 h-4" />
                  색상
                </button>
                {showColors && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-[#1a2744] border border-white/20 rounded-lg shadow-xl grid grid-cols-5 gap-1.5 z-50">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => applyColor(c.value)}
                        className="w-7 h-7 rounded-md border border-white/20 hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 구분선 */}
              <div className="w-px h-6 bg-white/20" />

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
