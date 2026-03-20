"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X } from "lucide-react";

const benefits = [
  { title: "세금 혜택", desc: "후원금은 소득세법에 따라 기부금 세액공제 혜택을 받으실 수 있습니다." },
  { title: "후원 감사장", desc: "연간 100만원 이상 후원 시 한국유소년체스연맹 이사장 명의의 감사장을 수여합니다." },
  { title: "행사 초청", desc: "주요 행사 및 포럼에 VIP로 초청되어 네트워킹 기회를 제공받습니다." },
  { title: "소식지 발송", desc: "분기별 한국유소년체스연맹 소식지 및 연간 보고서를 받아보실 수 있습니다." },
];

export default function SupportPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fallbackContent = `(사)한국유소년체스연맹은 대한민국 인재 양성과 직업능력 개발을 위해 노력하고 있습니다. 여러분의 소중한 후원은 청년 취업 지원, 소외 계층 직업교육, 자격검정 제도 발전에 사용됩니다. 작은 관심이 큰 변화를 만듭니다.`;

  const [content, setContent] = useState(fallbackContent);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/support")
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
      const res = await fetch("/api/page-content/support", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: editContent }) });
      if (res.ok) { setContent(editContent); setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch { alert("저장에 실패했습니다."); } finally { setSaving(false); }
  };

  const renderDefaultContent = () => (
    <div className="space-y-16">
      {/* Introduction */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">한국유소년체스연맹와 <span className="text-[#c9a84c]">함께</span>해 주세요</h2>
        <div className="w-16 h-0.5 bg-[#c9a84c] rounded-full mx-auto mb-6" />
        <div className="text-gray-300 leading-relaxed space-y-3">
          {content.split(/\n\n+/).filter(p => p.trim()).map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-line">{paragraph}</p>
          ))}
        </div>
      </section>

      {/* How to Support */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#c9a84c] rounded-full" />후원 방법</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#111d35] border border-white/10 p-6">
            <h4 className="text-[#c9a84c] font-semibold mb-3">정기 후원</h4>
            <p className="text-gray-300 text-sm leading-relaxed">매월 일정 금액을 자동이체로 후원하실 수 있습니다. 정기 후원자에게는 연말정산용 기부금 영수증을 일괄 발급해 드립니다. 월 1만원부터 참여 가능합니다.</p>
          </div>
          <div className="rounded-2xl bg-[#111d35] border border-white/10 p-6">
            <h4 className="text-[#c9a84c] font-semibold mb-3">일시 후원</h4>
            <p className="text-gray-300 text-sm leading-relaxed">원하시는 금액을 1회 후원하실 수 있습니다. 아래 계좌로 입금 후 사무국으로 연락 주시면 기부금 영수증을 발급해 드립니다.</p>
          </div>
        </div>
      </section>

      {/* Bank Account */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#c9a84c] rounded-full" />후원 계좌 안내</h3>
        <div className="rounded-2xl bg-gradient-to-br from-[#111d35] to-[#1a2744] border border-[#c9a84c]/20 p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><p className="text-gray-400 text-sm mb-1">은행명</p><p className="text-white font-semibold text-lg">국민은행</p></div>
            <div><p className="text-gray-400 text-sm mb-1">계좌번호</p><p className="text-[#c9a84c] font-semibold text-lg">123-456-789012</p></div>
            <div><p className="text-gray-400 text-sm mb-1">예금주</p><p className="text-white font-semibold text-lg">(사)한국유소년체스연맹</p></div>
            <div><p className="text-gray-400 text-sm mb-1">입금 시 참고</p><p className="text-white font-semibold text-lg">성함 + &quot;후원&quot;</p></div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#c9a84c] rounded-full" />후원자 혜택</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="rounded-2xl bg-[#111d35] border border-white/10 p-6 hover:border-[#c9a84c]/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mb-4"><span className="text-[#c9a84c] font-bold text-sm">{String(i + 1).padStart(2, "0")}</span></div>
              <h4 className="text-white font-semibold mb-2">{b.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="w-1.5 h-6 bg-[#c9a84c] rounded-full" />후원 문의</h3>
        <div className="rounded-2xl bg-[#111d35] border border-white/10 p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div><p className="text-gray-400 text-sm mb-1">담당부서</p><p className="text-white font-medium">사무국 후원팀</p></div>
            <div><p className="text-gray-400 text-sm mb-1">전화번호</p><p className="text-white font-medium">02-1234-5678</p></div>
            <div><p className="text-gray-400 text-sm mb-1">이메일</p><p className="text-white font-medium">support@daehantalent.or.kr</p></div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <>
      <PageBanner title="후원 및 기부" breadcrumb={[{ label: "홈", href: "/" }, { label: "알림마당", href: "/notice" }, { label: "후원 및 기부", href: "/notice/support" }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {isAdmin && !editing && (
          <div className="flex items-center gap-3">
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
