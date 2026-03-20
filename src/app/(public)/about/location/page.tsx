"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Save, X, MapPin, Phone, Printer, Mail, TrainFront, Bus } from "lucide-react";

export default function LocationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fallbackContent = `한국유소년체스연맹 본부 위치 및 교통 안내입니다.`;

  const [content, setContent] = useState(fallbackContent);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/page-content/location")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.content && data.content.trim() && data.content.length <= 500) {
          setContent(data.content);
        }
      })
      .catch(() => {});
  }, []);

  const startEdit = () => {
    setEditContent(content);
    setEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/page-content/location", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        setContent(editContent);
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

  const renderDefaultContent = () => (
    <div className="space-y-12">
      <div className="text-center text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed space-y-3">
        {content.split(/\n\n+/).filter(p => p.trim()).map((paragraph, idx) => (
          <p key={idx} className="whitespace-pre-line">{paragraph}</p>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="w-full h-[400px] rounded-2xl bg-[#1a2744] border border-white/10 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <span className="text-gray-500 text-sm">지도 영역</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address & Contact */}
        <div className="rounded-2xl border border-white/10 bg-[#111d35]/80 p-8 space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">연락처 정보</h3>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400 mb-1">주소</p>
              <p className="text-white text-sm">
                (04524) 서울특별시 중구 세종대로 110, 한국유소년체스연맹빌딩 8층
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400 mb-1">대표전화</p>
              <p className="text-white text-sm">02-1234-5678</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Printer className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400 mb-1">팩스</p>
              <p className="text-white text-sm">02-1234-5679</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-400 mb-1">이메일</p>
              <p className="text-white text-sm">info@daehantalent.kr</p>
            </div>
          </div>
        </div>

        {/* Transportation */}
        <div className="rounded-2xl border border-white/10 bg-[#111d35]/80 p-8 space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">교통 안내</h3>

          <div className="flex items-start gap-3">
            <TrainFront className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#c9a84c] font-medium mb-2">
                지하철
              </p>
              <ul className="space-y-1.5 text-sm text-gray-300">
                <li>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-green-600/20 text-green-400 text-xs mr-2">
                    2호선
                  </span>
                  시청역 10번 출구 도보 5분
                </li>
                <li>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 text-xs mr-2">
                    1호선
                  </span>
                  시청역 3번 출구 도보 7분
                </li>
                <li>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-orange-600/20 text-orange-400 text-xs mr-2">
                    5호선
                  </span>
                  광화문역 5번 출구 도보 10분
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Bus className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#c9a84c] font-medium mb-2">버스</p>
              <ul className="space-y-1.5 text-sm text-gray-300">
                <li>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 text-xs mr-2">
                    간선
                  </span>
                  101, 103, 150, 402, 604
                </li>
                <li>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-green-600/20 text-green-400 text-xs mr-2">
                    지선
                  </span>
                  7017, 7021
                </li>
                <li className="text-gray-400 text-xs mt-1">
                  * 시청앞·덕수궁 정류장 하차
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageBanner
        title="오시는길"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "한국유소년체스연맹", href: "/about" },
          { label: "오시는길", href: "/about/location" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
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

        {editing ? (
          <div className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#222]">페이지 수정</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">본문 내용 (문단 구분: 빈 줄)</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={15}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[#222] focus:outline-none focus:border-[#2B5BA8] focus:ring-1 focus:ring-[#2B5BA8] leading-relaxed"
              />
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
          renderDefaultContent()
        )}
      </div>
    </>
  );
}
