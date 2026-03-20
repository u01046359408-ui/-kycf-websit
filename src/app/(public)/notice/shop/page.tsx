"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X } from "lucide-react";

const products = [
  { id: 1, name: "자격검정 공식 교재 (AI데이터분석사)", price: 35000 },
  { id: 2, name: "직업능력개발 실무 핸드북", price: 28000 },
  { id: 3, name: "자격증 액자 (고급 원목 프레임)", price: 45000 },
  { id: 4, name: "한국유소년체스연맹 공식 수험서 세트 (3권)", price: 89000 },
  { id: 5, name: "온라인 강의 수강권 (6개월)", price: 150000 },
  { id: 6, name: "자격시험 모의고사 문제집", price: 22000 },
];

function formatPrice(price: number) {
  return price.toLocaleString("ko-KR");
}

export default function ShopPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fallbackContent = `한국유소년체스연맹 공식 교재 및 자격검정 관련 상품을 구매하실 수 있습니다.`;

  const [content, setContent] = useState(fallbackContent);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/shop")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content && data.content.trim() && data.content.length <= 500) setContent(data.content);
      })
      .catch(() => {});
  }, []);

  const startEdit = () => { setEditContent(content); setEditing(true); setSaved(false); };
  const cancelEdit = () => { setEditing(false); };
  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/page-content/shop", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: editContent }) });
      if (res.ok) { setContent(editContent); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch { alert("저장에 실패했습니다."); } finally { setSaving(false); }
  };

  const renderDefaultContent = () => (
    <>
      <div className="text-gray-400 text-sm mb-8 space-y-3">
        {content.split(/\n\n+/).filter(p => p.trim()).map((paragraph, idx) => (
          <p key={idx} className="whitespace-pre-line">{paragraph}</p>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="rounded-2xl bg-[#111d35] border border-white/10 overflow-hidden hover:border-[#c9a84c]/30 transition-all duration-300 group">
            <div className="aspect-[4/3] bg-[#1a2744] flex flex-col items-center justify-center gap-2">
              <svg className="w-12 h-12 text-gray-600 group-hover:text-[#c9a84c]/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-xs text-gray-600">상품 이미지</span>
            </div>
            <div className="p-5">
              <h3 className="text-white font-medium text-sm leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">{product.name}</h3>
              <p className="text-[#c9a84c] font-bold text-lg mb-4">{formatPrice(product.price)}<span className="text-sm font-normal ml-0.5">원</span></p>
              <button className="w-full py-2.5 rounded-lg bg-[#c9a84c] text-[#0a1628] font-semibold text-sm hover:bg-[#d4b85c] transition-colors">구매하기</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <PageBanner title="E-Shop" breadcrumb={[{ label: "홈", href: "/" }, { label: "알림마당", href: "/notice" }, { label: "E-Shop", href: "/notice/shop" }]} />
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
        ) : renderDefaultContent()}
      </div>
    </>
  );
}
