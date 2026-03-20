"use client";

import { useState, useEffect, useCallback } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X } from "lucide-react";
import type { EventItem, EventStatus } from "@/types";

function StatusBadge({ status }: { status: EventStatus }) {
  const colorMap: Record<EventStatus, string> = {
    접수중: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    마감: "bg-red-500/20 text-red-400 border-red-500/30",
    예정: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorMap[status]}`}>
      {status}
    </span>
  );
}

export default function EventSchedulePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin editing state
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content/events?limit=20");
      const data = await res.json();
      setEvents(data.data || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetch("/api/page-content/schedule")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content && data.content.trim()) setContent(data.content);
      })
      .catch(() => {});
  }, []);

  const startEdit = () => { setEditContent(content); setEditing(true); setSaved(false); };
  const cancelEdit = () => { setEditing(false); };
  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/page-content/schedule", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: editContent }) });
      if (res.ok) { setContent(editContent); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch { alert("저장에 실패했습니다."); } finally { setSaving(false); }
  };

  const renderApiContent = () => (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="prose prose-invert max-w-none">
        {content.split(/\n\n+/).map((paragraph, idx) => (
          <p key={idx} className="text-gray-300 leading-relaxed whitespace-pre-line">{paragraph}</p>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <PageBanner title="행사일정" breadcrumb={[{ label: "홈", href: "/" }, { label: "행사/인재", href: "/events" }, { label: "행사일정", href: "/events/schedule" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAdmin && !editing && (
          <div className="mb-6 flex items-center gap-3">
            <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-[#C5963A] text-white text-sm font-medium rounded-lg hover:bg-[#B08530] transition-colors"><Pencil className="w-4 h-4" />이 페이지 수정</button>
            {saved && <span className="text-green-500 text-sm">저장되었습니다!</span>}
          </div>
        )}

        {editing ? (
          <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6 mb-12">
            <h3 className="text-lg font-bold text-[#222]">페이지 수정</h3>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">본문 내용 (문단 구분: 빈 줄)</label><textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={15} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8] focus:ring-1 focus:ring-[#2B5BA8] leading-relaxed" /></div>
            <div className="flex gap-3">
              <button onClick={saveEdit} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#2B5BA8] text-white font-medium rounded-lg hover:bg-[#1E4A8F] transition-colors disabled:opacity-50"><Save className="w-4 h-4" />{saving ? "저장 중..." : "저장"}</button>
              <button onClick={cancelEdit} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"><X className="w-4 h-4" />취소</button>
            </div>
          </div>
        ) : content ? renderApiContent() : null}

        {/* 섹션 헤더 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">다가오는 <span className="text-[#c9a84c]">행사 일정</span></h2>
          <p className="mt-2 text-gray-400">한국유소년체스연맹에서 주최하는 행사 및 대회 일정을 확인하세요.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">등록된 행사일정이 없습니다.</div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="group relative rounded-xl border border-white/10 bg-[#111d35]/80 backdrop-blur-sm p-6 hover:border-[#c9a84c]/30 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-shrink-0 w-28 text-center">
                    <div className="bg-[#1a2744] rounded-lg px-4 py-3 border border-white/5">
                      <p className="text-[#c9a84c] font-bold text-sm">{event.date.split(" ")[0]}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{event.date.split(" ").slice(1).join(" ")}</p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs text-[#c9a84c]/70 font-medium bg-[#c9a84c]/10 px-2 py-0.5 rounded">{event.category}</span>
                      <StatusBadge status={event.status} />
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#d4b85c] transition-colors">{event.title}</h3>
                    {event.location && <p className="text-sm text-gray-400 mt-1"><span className="inline-block mr-1">📍</span>{event.location}</p>}
                  </div>
                  <div className="flex-shrink-0">
                    {event.status === "접수중" ? (
                      <button className="px-5 py-2 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] font-semibold text-sm rounded-lg hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all duration-300">접수하기</button>
                    ) : event.status === "예정" ? (
                      <span className="px-5 py-2 border border-blue-500/30 text-blue-400 text-sm rounded-lg inline-block">준비중</span>
                    ) : (
                      <span className="px-5 py-2 border border-white/10 text-gray-500 text-sm rounded-lg inline-block">접수마감</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500/60" />접수중</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500/40 border border-blue-500/60" />예정</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/60" />마감</div>
        </div>
      </div>
    </>
  );
}
