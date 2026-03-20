"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X } from "lucide-react";

interface InternationalResult {
  id: number;
  competition: string;
  date: string;
  location: string;
  result: string;
  participants: string;
}

const results: InternationalResult[] = [
  { id: 1, competition: "2025 아시아 인재개발 챔피언십", date: "2025.11.15 ~ 11.17", location: "일본 도쿄, 도쿄빅사이트", result: "종합 2위 (금 3, 은 5, 동 2)", participants: "선수 24명, 임원 8명" },
  { id: 2, competition: "제12회 국제 직업능력 올림피아드", date: "2025.09.20 ~ 09.25", location: "독일 프랑크푸르트, 메세 프랑크푸르트", result: "종합 5위 (금 1, 은 3, 동 4)", participants: "선수 18명, 임원 6명" },
  { id: 3, competition: "2025 한중일 인재교류 대회", date: "2025.07.08 ~ 07.10", location: "중국 베이징, 국가회의중심", result: "종합 우승 (금 5, 은 2, 동 1)", participants: "선수 16명, 임원 5명" },
  { id: 4, competition: "제8회 동남아시아 기술교류전", date: "2025.05.12 ~ 05.14", location: "베트남 호치민, 사이공 컨벤션센터", result: "종합 3위 (금 2, 은 4, 동 3)", participants: "선수 20명, 임원 7명" },
  { id: 5, competition: "2024 세계 인재개발 포럼 경진부문", date: "2024.10.22 ~ 10.26", location: "프랑스 파리, 팔레 데 콩그레", result: "종합 4위 (금 2, 은 3, 동 5)", participants: "선수 22명, 임원 8명" },
];

export default function ResultsInternationalPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/results-international")
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
      const res = await fetch("/api/page-content/results-international", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: editContent }) });
      if (res.ok) { setContent(editContent); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch { alert("저장에 실패했습니다."); } finally { setSaving(false); }
  };

  const renderApiContent = () => (
    <div className="max-w-3xl mx-auto"><div className="prose prose-invert max-w-none">{content.split(/\n\n+/).map((p, i) => <p key={i} className="text-gray-300 leading-relaxed whitespace-pre-line">{p}</p>)}</div></div>
  );

  const renderDefaultContent = () => (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">국제 대회 <span className="text-[#c9a84c]">성과</span></h2>
        <p className="mt-2 text-gray-400">한국유소년체스연맹 소속 선수단의 국제 대회 참가 결과입니다.</p>
      </div>
      <div className="rounded-xl border border-white/10 overflow-hidden bg-[#111d35]/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#1a2744]">
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">대회명</th>
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">날짜</th>
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">장소</th>
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">결과</th>
              <th className="px-6 py-4 text-left text-[#c9a84c] font-semibold whitespace-nowrap">참가규모</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {results.map((item, index) => (
                <tr key={item.id} className={`hover:bg-[#c9a84c]/5 transition-colors ${index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}>
                  <td className="px-6 py-4 text-white font-medium">{item.competition}</td>
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 text-gray-300">{item.location}</td>
                  <td className="px-6 py-4 text-[#d4b85c] font-medium">{item.result}</td>
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">{item.participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl border border-white/10 bg-[#111d35]/80 backdrop-blur-sm p-6 text-center"><p className="text-3xl font-bold text-[#c9a84c]">13</p><p className="mt-2 text-sm text-gray-400">금메달 총 획득수</p></div>
        <div className="rounded-xl border border-white/10 bg-[#111d35]/80 backdrop-blur-sm p-6 text-center"><p className="text-3xl font-bold text-white">17</p><p className="mt-2 text-sm text-gray-400">은메달 총 획득수</p></div>
        <div className="rounded-xl border border-white/10 bg-[#111d35]/80 backdrop-blur-sm p-6 text-center"><p className="text-3xl font-bold text-gray-300">15</p><p className="mt-2 text-sm text-gray-400">동메달 총 획득수</p></div>
      </div>
    </>
  );

  return (
    <>
      <PageBanner title="국외 결과" breadcrumb={[{ label: "홈", href: "/" }, { label: "행사/인재", href: "/events" }, { label: "국외 결과", href: "/events/results-international" }]} />
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
