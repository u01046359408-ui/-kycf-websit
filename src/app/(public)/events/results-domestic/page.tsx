"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X } from "lucide-react";

interface DomesticResult {
  id: number;
  competition: string;
  date: string;
  location: string;
  result: string;
  note: string;
}

const results: DomesticResult[] = [
  { id: 1, competition: "제18회 전국 인재개발 경진대회 (춘계)", date: "2026.03.08", location: "광주 김대중컨벤션센터", result: "참가 48팀 / 수상 12팀", note: "최우수상: 서울특별시 대표팀" },
  { id: 2, competition: "2025 하반기 직업능력개발 경시대회", date: "2025.11.02", location: "대구 엑스코(EXCO)", result: "참가 62팀 / 수상 18팀", note: "대상: 경기도 대표팀" },
  { id: 3, competition: "제17회 전국 인재개발 경진대회 (추계)", date: "2025.09.14", location: "서울 올림픽공원 체조경기장", result: "참가 55팀 / 수상 15팀", note: "최우수상: 부산광역시 대표팀" },
  { id: 4, competition: "2025 전국 청소년 인재 올림피아드", date: "2025.07.20", location: "인천 송도컨벤시아", result: "참가 120명 / 수상 30명", note: "대상: 김민준 (서울 한영고)" },
  { id: 5, competition: "제6회 전국 지도사 기술경연대회", date: "2025.05.18", location: "대전 컨벤션센터", result: "참가 38명 / 수상 10명", note: "최우수상: 박성호 (경기지부)" },
  { id: 6, competition: "2025 상반기 직업능력개발 경시대회", date: "2025.04.12", location: "부산 벡스코 제2전시장", result: "참가 58팀 / 수상 16팀", note: "대상: 충남 대표팀" },
];

export default function ResultsDomesticPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/results-domestic")
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
      const res = await fetch("/api/page-content/results-domestic", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: editContent }) });
      if (res.ok) { setContent(editContent); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch { alert("저장에 실패했습니다."); } finally { setSaving(false); }
  };

  const renderApiContent = () => (
    <div className="max-w-3xl mx-auto"><div className="prose prose-invert max-w-none">{content.split(/\n\n+/).map((p, i) => <p key={i} className="text-gray-300 leading-relaxed whitespace-pre-line">{p}</p>)}</div></div>
  );

  const renderDefaultContent = () => (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">국내 대회 <span className="text-[#c9a84c]">결과</span></h2>
        <p className="mt-2 text-gray-400">전국 각지에서 개최된 인재개발 관련 대회의 결과를 확인하세요.</p>
      </div>
      <div className="rounded-xl border border-white/10 overflow-hidden bg-[#111d35]/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#1a2744]">
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">번호</th>
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">대회명</th>
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">날짜</th>
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">장소</th>
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">결과</th>
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">비고</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {results.map((item, index) => (
                <tr key={item.id} className={`hover:bg-[#c9a84c]/5 transition-colors ${index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}>
                  <td className="px-6 py-4 text-gray-400 text-center">{item.id}</td>
                  <td className="px-6 py-4 text-white font-medium">{item.competition}</td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">{item.location}</td>
                  <td className="px-6 py-4 text-gray-300">{item.result}</td>
                  <td className="px-6 py-4 text-[#d4b85c] font-medium">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 flex justify-center items-center gap-2">
        <button className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors">&laquo;</button>
        <button className="w-9 h-9 rounded-lg bg-[#c9a84c] text-[#0a1628] font-semibold text-sm">1</button>
        <button className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors">2</button>
        <button className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors">3</button>
        <button className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors">&raquo;</button>
      </div>
    </>
  );

  return (
    <>
      <PageBanner title="국내 결과" breadcrumb={[{ label: "홈", href: "/" }, { label: "행사/인재", href: "/events" }, { label: "국내 결과", href: "/events/results-domestic" }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAdmin && !editing && (
          <div className="mb-6 flex items-center gap-3">
            <button onClick={startEdit} className="flex items-center gap-2 px-4 py-2 bg-[#C5963A] text-white text-sm font-medium rounded-lg hover:bg-[#B08530] transition-colors"><Pencil className="w-4 h-4" />이 페이지 수정</button>
            {saved && <span className="text-green-500 text-sm">저장되었습니다!</span>}
          </div>
        )}
        {editing ? (
          <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#222]">페이지 수정</h3>
            <div><label className="block text-sm font-medium text-gray-600 mb-1">본문 내용 (문단 구분: 빈 줄)</label><textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={15} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8] focus:ring-1 focus:ring-[#2B5BA8] leading-relaxed" /></div>
            <div className="flex gap-3">
              <button onClick={saveEdit} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#2B5BA8] text-white font-medium rounded-lg hover:bg-[#1E4A8F] transition-colors disabled:opacity-50"><Save className="w-4 h-4" />{saving ? "저장 중..." : "저장"}</button>
              <button onClick={cancelEdit} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"><X className="w-4 h-4" />취소</button>
            </div>
          </div>
        ) : content ? renderApiContent() : renderDefaultContent()}
      </div>
    </>
  );
}
