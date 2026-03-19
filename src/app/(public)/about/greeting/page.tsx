"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X } from "lucide-react";

export default function GreetingPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("한국유소년체스연맹를 방문해 주신\n여러분을 진심으로 환영합니다.");
  const [repName, setRepName] = useState("홍 길 동");
  const [repTitle, setRepTitle] = useState("(사)한국유소년체스연맹 이사장");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 임시 편집 상태
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editRepName, setEditRepName] = useState("");
  const [editRepTitle, setEditRepTitle] = useState("");

  const fallbackContent = `안녕하십니까. (사)한국유소년체스연맹 이사장 홍길동입니다. 바쁘신 와중에도 저희 한국유소년체스연맹 홈페이지를 방문해 주신 여러분께 깊은 감사의 말씀을 드립니다. 한국유소년체스연맹는 "사람이 곧 국가의 미래"라는 신념 아래, 대한민국의 인재 육성과 자격 인증 사업에 매진해 왔습니다.

우리 사회는 4차 산업혁명과 디지털 전환이라는 거대한 변화의 흐름 속에 있습니다. 이러한 시대적 전환기에 가장 중요한 것은 바로 '사람'입니다. 한국유소년체스연맹는 시대가 요구하는 전문 인력 양성을 위해 체계적인 교육 프로그램을 개발하고, 공정하고 신뢰할 수 있는 자격 인증 제도를 운영하고 있습니다.

또한, 지역사회와의 협력을 통해 소외 계층의 직업 교육과 취업 지원에도 힘쓰고 있으며, 산업체와의 긴밀한 파트너십을 바탕으로 현장 맞춤형 인재를 양성하는 데 주력하고 있습니다.

여러분의 관심과 성원이 저희에게 큰 힘이 됩니다. 언제든지 의견을 주시면 귀담아 듣고 더 나은 서비스를 제공하기 위해 노력하겠습니다. 감사합니다.`;

  useEffect(() => {
    fetch("/api/page-content/greeting")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.content) setContent(data.content);
        else setContent(fallbackContent);

        if (data?.metadata) {
          if (data.metadata.title) setTitle(data.metadata.title);
          if (data.metadata.repName) setRepName(data.metadata.repName);
          if (data.metadata.repTitle) setRepTitle(data.metadata.repTitle);
        }
      })
      .catch(() => setContent(fallbackContent));
  }, []);

  const startEdit = () => {
    setEditContent(content);
    setEditTitle(title);
    setEditRepName(repName);
    setEditRepTitle(repTitle);
    setEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/page-content/greeting", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editContent,
          metadata: {
            title: editTitle,
            repName: editRepName,
            repTitle: editRepTitle,
          },
        }),
      });

      if (res.ok) {
        setContent(editContent);
        setTitle(editTitle);
        setRepName(editRepName);
        setRepTitle(editRepTitle);
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

  const paragraphs = content
    ? content.split(/\n\n+/).filter((p) => p.trim())
    : [];

  return (
    <>
      <PageBanner
        title="인사말"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "한국유소년체스연맹", href: "/about" },
          { label: "인사말", href: "/about/greeting" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 관리자 편집 버튼 */}
        {isAdmin && !editing && (
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={startEdit}
              className="flex items-center gap-2 px-4 py-2 bg-[#C5963A] text-white text-sm font-medium rounded-lg hover:bg-[#B08530] transition-colors"
            >
              <Pencil className="w-4 h-4" />
              이 페이지 수정
            </button>
            {saved && (
              <span className="text-green-500 text-sm">저장되었습니다!</span>
            )}
          </div>
        )}

        {/* 편집 모드 */}
        {editing ? (
          <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#222]">페이지 수정</h3>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">제목 (줄바꿈: Enter)</label>
              <textarea
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8] focus:ring-1 focus:ring-[#2B5BA8]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">본문 내용 (문단 구분: 빈 줄)</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={15}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8] focus:ring-1 focus:ring-[#2B5BA8] leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">대표자 이름</label>
                <input
                  value={editRepName}
                  onChange={(e) => setEditRepName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">대표자 직함</label>
                <input
                  value={editRepTitle}
                  onChange={(e) => setEditRepTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#2B5BA8] text-white font-medium rounded-lg hover:bg-[#1E4A8F] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                취소
              </button>
            </div>
          </div>
        ) : (
          /* 일반 보기 모드 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1 flex flex-col items-center">
              <div className="w-64 h-80 rounded-2xl bg-[#1a2744] border border-white/10 flex items-center justify-center">
                <span className="text-gray-500 text-sm">대표 사진</span>
              </div>
              <div className="mt-6 text-center">
                <p className="text-xl font-bold text-[#1B2A4A]">{repName}</p>
                <p className="mt-1 text-sm text-[#C5963A]">{repTitle}</p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-[#1B2A4A] leading-relaxed whitespace-pre-line">
                {title}
              </h2>

              <div className="w-16 h-0.5 bg-[#C5963A] rounded-full" />

              {paragraphs.map((paragraph, idx) => (
                <p key={idx} className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 text-right">
                <p className="text-gray-400 text-sm">{repTitle}</p>
                <p className="text-[#1B2A4A] text-lg font-semibold mt-1">{repName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
