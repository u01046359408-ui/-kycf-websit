"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { updatePassword } from "@/lib/auth/actions";

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 비밀번호 유효성 검사
  const validatePassword = (): string | null => {
    if (newPassword.length < 6) {
      return "비밀번호는 최소 6자 이상이어야 합니다.";
    }
    if (newPassword !== confirmPassword) {
      return "새 비밀번호가 일치하지 않습니다.";
    }
    return null;
  };

  // 비밀번호 강도 계산
  const getPasswordStrength = (): {
    level: number;
    label: string;
    color: string;
  } => {
    if (!newPassword) return { level: 0, label: "", color: "" };
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (newPassword.length >= 10) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { level: 1, label: "약함", color: "bg-red-500" };
    if (score <= 2)
      return { level: 2, label: "보통", color: "bg-yellow-500" };
    if (score <= 3)
      return { level: 3, label: "양호", color: "bg-blue-500" };
    return { level: 4, label: "강함", color: "bg-green-500" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const validationError = validatePassword();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({
          type: "success",
          text: "비밀번호가 성공적으로 변경되었습니다.",
        });
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage({
        type: "error",
        text: "비밀번호 변경에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

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

      {/* 비밀번호 변경 카드 */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c9a84c]/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">비밀번호 변경</h3>
              <p className="text-sm text-gray-400 mt-0.5">
                새 비밀번호를 입력하여 변경하세요.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 새 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              새 비밀번호
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c9a84c]/50 transition-all pr-12"
                placeholder="새 비밀번호 (6자 이상)"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* 비밀번호 강도 표시 */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= strength.level ? strength.color : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  비밀번호 강도:{" "}
                  <span
                    className={
                      strength.level <= 1
                        ? "text-red-400"
                        : strength.level <= 2
                          ? "text-yellow-400"
                          : strength.level <= 3
                            ? "text-blue-400"
                            : "text-green-400"
                    }
                  >
                    {strength.label}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              새 비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none transition-all pr-12 ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "border-red-500/50"
                    : "border-white/10 focus:border-[#c9a84c]/50"
                }`}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-400 mt-1">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 안내 사항 */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
              <div className="text-xs text-gray-400 space-y-1">
                <p>• 비밀번호는 최소 6자 이상이어야 합니다.</p>
                <p>
                  • 영문 대/소문자, 숫자, 특수문자를 혼합하면 더 안전합니다.
                </p>
                <p>• 이전에 사용한 비밀번호는 재사용할 수 없습니다.</p>
              </div>
            </div>
          </div>

          {/* 변경 버튼 */}
          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="w-full py-3 bg-gradient-to-r from-[#c9a84c] to-[#d4b85c] text-[#0a1628] rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      </div>
    </div>
  );
}
