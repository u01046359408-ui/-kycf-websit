"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Save,
  Lock,
  Cake,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export default function MyProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 수정 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birth_date: "",
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
          setFormData({
            name: data.name ?? "",
            phone: data.phone ?? "",
            birth_date: data.birth_date ?? "",
          });
        }
      } catch (err) {
        console.error("프로필 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  // 프로필 수정 저장
  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name || null,
          phone: formData.phone || null,
          birth_date: formData.birth_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({
        ...profile,
        name: formData.name || null,
        phone: formData.phone || null,
        birth_date: formData.birth_date || null,
      });
      setEditing(false);
      setMessage({ type: "success", text: "프로필이 수정되었습니다." });
    } catch (err) {
      console.error("프로필 수정 실패:", err);
      setMessage({
        type: "error",
        text: "프로필 수정에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setSaving(false);
    }
  };

  // 비밀번호 변경 요청
  const handlePasswordReset = async () => {
    if (!profile?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        profile.email,
        { redirectTo: `${window.location.origin}/auth/callback` }
      );

      if (error) throw error;
      setMessage({
        type: "success",
        text: "비밀번호 변경 이메일이 발송되었습니다.",
      });
    } catch (err) {
      console.error("비밀번호 재설정 실패:", err);
      setMessage({
        type: "error",
        text: "이메일 발송에 실패했습니다.",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-white/10 rounded w-32" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-white/10 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
        <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 알림 메시지 */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm border ${
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 내 정보 카드 */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">내 정보</h3>
            <p className="text-sm text-gray-400 mt-1">
              회원 정보를 확인하고 수정할 수 있습니다.
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all border border-white/10"
            >
              수정
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* 이름 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                이름
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a84c]/50 transition-all"
                  placeholder="이름을 입력하세요"
                />
              ) : (
                <p className="mt-1 text-white">{profile.name ?? "-"}</p>
              )}
            </div>
          </div>

          {/* 이메일 (수정 불가) */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                이메일
              </label>
              <p className="mt-1 text-white">{profile.email}</p>
              {editing && (
                <p className="text-xs text-gray-500 mt-1">
                  이메일은 변경할 수 없습니다.
                </p>
              )}
            </div>
          </div>

          {/* 전화번호 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                전화번호
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a84c]/50 transition-all"
                  placeholder="010-0000-0000"
                />
              ) : (
                <p className="mt-1 text-white">{profile.phone ?? "-"}</p>
              )}
            </div>
          </div>

          {/* 생년월일 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
              <Cake className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                생년월일
              </label>
              {editing ? (
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a84c]/50 transition-all [color-scheme:dark]"
                />
              ) : (
                <p className="mt-1 text-white">
                  {profile.birth_date
                    ? formatDate(profile.birth_date)
                    : "-"}
                </p>
              )}
            </div>
          </div>

          {/* 가입일 (수정 불가) */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                가입일
              </label>
              <p className="mt-1 text-white">
                {formatDate(profile.created_at)}
              </p>
            </div>
          </div>

          {/* 수정 모드 버튼 */}
          {editing && (
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                <Save className="w-4 h-4" />
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    name: profile.name ?? "",
                    phone: profile.phone ?? "",
                    birth_date: profile.birth_date ?? "",
                  });
                }}
                className="px-5 py-2.5 bg-white/5 text-gray-300 rounded-lg text-sm hover:bg-white/10 transition-all border border-white/10"
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 비밀번호 변경 */}
      {profile.provider === "email" && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">
                  비밀번호 변경
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  이메일로 비밀번호 변경 링크가 발송됩니다.
                </p>
              </div>
            </div>
            <button
              onClick={handlePasswordReset}
              className="text-sm px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all border border-white/10"
            >
              변경 요청
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
