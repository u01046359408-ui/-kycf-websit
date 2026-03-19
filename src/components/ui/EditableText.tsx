"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X } from "lucide-react";

interface EditableTextProps {
  /** page_contents 테이블의 page_key */
  pageKey: string;
  /** 현재 표시할 텍스트 */
  children: React.ReactNode;
  /** 편집할 텍스트 (children과 다를 수 있음) */
  value: string;
  /** 저장 후 콜백 */
  onSave?: (newValue: string) => void;
  /** textarea 또는 input */
  multiline?: boolean;
  /** 추가 className */
  className?: string;
}

/**
 * 관리자일 때 텍스트를 클릭하면 바로 편집 가능한 컴포넌트
 * 일반 사용자에게는 그냥 텍스트로 보임
 */
export default function EditableText({
  pageKey,
  children,
  value,
  onSave,
  multiline = false,
  className = "",
}: EditableTextProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saving, setSaving] = useState(false);

  if (!isAdmin) {
    return <>{children}</>;
  }

  if (!editing) {
    return (
      <div className={`group relative ${className}`}>
        {children}
        <button
          onClick={() => {
            setEditValue(value);
            setEditing(true);
          }}
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#C5963A] text-white p-1.5 rounded-full shadow-lg hover:bg-[#B08530] z-10"
          title="수정"
        >
          <Pencil className="w-3 h-3" />
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/page-content/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editValue }),
      });
      if (res.ok) {
        onSave?.(editValue);
        setEditing(false);
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch {
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-2 border-[#2B5BA8] rounded-lg p-3 bg-white">
      {multiline ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-200 rounded text-[#222] focus:outline-none focus:border-[#2B5BA8] leading-relaxed text-sm resize-y"
        />
      ) : (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded text-[#222] focus:outline-none focus:border-[#2B5BA8] text-sm"
        />
      )}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#2B5BA8] text-white text-xs font-medium rounded hover:bg-[#1E4A8F] disabled:opacity-50"
        >
          <Save className="w-3 h-3" />
          {saving ? "저장 중..." : "저장"}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-500 text-xs rounded hover:bg-gray-50"
        >
          <X className="w-3 h-3" />
          취소
        </button>
      </div>
    </div>
  );
}
