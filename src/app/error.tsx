"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Lock broken 에러는 무시하고 자동 재시도
    if (error.message?.includes("Lock broken") || error.message?.includes("AbortError")) {
      reset();
      return;
    }
    console.error("App error:", error);
  }, [error, reset]);

  // Lock broken 에러는 화면에 표시하지 않음
  if (error.message?.includes("Lock broken") || error.message?.includes("AbortError")) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        <h2 className="text-2xl font-bold text-[#1B2A4A] mb-4">
          문제가 발생했습니다
        </h2>
        <p className="text-gray-500 mb-6">
          일시적인 오류가 발생했습니다. 다시 시도해 주세요.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#2B5BA8] text-white font-medium rounded-lg hover:bg-[#1E4A8F] transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
