"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import { ArrowLeft, Calendar, Eye, Tag } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  created_at: string;
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`/api/content/announcements/${params.id}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setItem(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchItem();
    }
  }, [params.id]);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
  }

  if (loading) {
    return (
      <>
        <PageBanner
          title="공지사항"
          breadcrumb={[
            { label: "HOME", href: "/" },
            { label: "알림마당", href: "/notice/announcements" },
            { label: "공지사항", href: "/notice/announcements" },
          ]}
        />
        <div className="max-w-[1200px] mx-auto px-6 py-16 text-center text-gray-400">
          불러오는 중...
        </div>
      </>
    );
  }

  if (error || !item) {
    return (
      <>
        <PageBanner
          title="공지사항"
          breadcrumb={[
            { label: "HOME", href: "/" },
            { label: "알림마당", href: "/notice/announcements" },
            { label: "공지사항", href: "/notice/announcements" },
          ]}
        />
        <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
          <p className="text-gray-500 mb-6">공지사항을 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push("/notice/announcements")}
            className="px-6 py-3 bg-[#2B5BA8] text-white rounded-lg hover:bg-[#1E4A8F] transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title="공지사항"
        breadcrumb={[
          { label: "HOME", href: "/" },
          { label: "알림마당", href: "/notice/announcements" },
          { label: item.title, href: `/notice/announcements/${item.id}` },
        ]}
      />

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* 상단: 제목 + 메타 정보 */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
              item.category === "연맹공지"
                ? "bg-[#C5963A]/10 text-[#C5963A]"
                : "bg-[#2B5BA8]/10 text-[#2B5BA8]"
            }`}>
              {item.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#222] mb-4">{item.title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(item.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              조회 {item.views}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              {item.category}
            </span>
          </div>
        </div>

        {/* 본문 내용 */}
        <div className="min-h-[200px] text-[#333] leading-relaxed whitespace-pre-wrap text-base">
          {item.content || "내용이 없습니다."}
        </div>

        {/* 하단: 목록 버튼 */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link
            href="/notice/announcements"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Link>
        </div>
      </div>
    </>
  );
}
