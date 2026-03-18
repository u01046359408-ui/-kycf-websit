"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Save,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { CertificateTemplate } from "@/types";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 템플릿 목록 조회
  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/admin/templates");
      if (!res.ok) throw new Error("템플릿 목록을 불러올 수 없습니다.");
      const data = await res.json();
      setTemplates(data.templates);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "데이터를 불러올 수 없습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 메시지 자동 숨기기
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 가격 수정 시작
  const startEditing = (template: CertificateTemplate) => {
    setEditingId(template.id);
    setEditPrice(template.price.toString());
  };

  // 가격 저장
  const handleSavePrice = async (templateId: string) => {
    const price = parseInt(editPrice, 10);
    if (isNaN(price) || price < 0) {
      setMessage({ type: "error", text: "올바른 가격을 입력해주세요." });
      return;
    }

    setSavingId(templateId);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: templateId, price }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "수정에 실패했습니다.");
      }

      const data = await res.json();
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? data.template : t))
      );
      setEditingId(null);
      setMessage({ type: "success", text: "가격이 수정되었습니다." });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "수정에 실패했습니다.",
      });
    } finally {
      setSavingId(null);
    }
  };

  // 활성/비활성 토글
  const handleToggleActive = async (template: CertificateTemplate) => {
    setSavingId(template.id);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: template.id,
          is_active: !template.is_active,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "상태 변경에 실패했습니다.");
      }

      const data = await res.json();
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? data.template : t))
      );
      setMessage({
        type: "success",
        text: `${template.name}이(가) ${!template.is_active ? "활성화" : "비활성화"}되었습니다.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "상태 변경에 실패했습니다.",
      });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">증명서 템플릿 관리</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse"
            >
              <div className="h-5 bg-white/10 rounded w-32 mb-3" />
              <div className="h-4 bg-white/10 rounded w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">증명서 템플릿 관리</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-bold text-white">증명서 템플릿 관리</h1>
        <p className="text-sm text-gray-400 mt-1">
          증명서 종류별 가격과 활성 상태를 관리합니다.
        </p>
      </div>

      {/* 알림 메시지 */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl text-sm border transition-all ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* 템플릿 목록 */}
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden transition-all ${
              template.is_active
                ? "border-white/10"
                : "border-white/5 opacity-60"
            }`}
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* 템플릿 정보 */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      template.is_active
                        ? "bg-[#c9a84c]/10"
                        : "bg-white/5"
                    }`}
                  >
                    <FileText
                      className={`w-6 h-6 ${
                        template.is_active
                          ? "text-[#c9a84c]"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">
                        {template.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          template.is_active
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}
                      >
                        {template.is_active ? "활성" : "비활성"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {template.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      유형: {template.type}
                    </p>
                  </div>
                </div>

                {/* 가격 및 액션 */}
                <div className="flex items-center gap-3 sm:shrink-0">
                  {editingId === template.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-28 px-3 py-2 bg-white/5 border border-[#c9a84c]/30 rounded-lg text-sm text-white text-right focus:outline-none focus:border-[#c9a84c]/50"
                        min="0"
                        step="1000"
                      />
                      <span className="text-sm text-gray-400">원</span>
                      <button
                        onClick={() => handleSavePrice(template.id)}
                        disabled={savingId === template.id}
                        className="p-2 bg-[#c9a84c]/10 text-[#c9a84c] rounded-lg hover:bg-[#c9a84c]/20 transition-colors disabled:opacity-50"
                        title="저장"
                      >
                        {savingId === template.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors"
                        title="취소"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(template)}
                      className="text-lg font-bold text-white hover:text-[#c9a84c] transition-colors cursor-pointer"
                      title="클릭하여 가격 수정"
                    >
                      {template.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        원
                      </span>
                    </button>
                  )}

                  {/* 활성/비활성 토글 */}
                  <button
                    onClick={() => handleToggleActive(template)}
                    disabled={savingId === template.id}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                    title={
                      template.is_active ? "비활성화" : "활성화"
                    }
                  >
                    {savingId === template.id ? (
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    ) : template.is_active ? (
                      <ToggleRight className="w-6 h-6 text-green-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">등록된 템플릿이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
