import type { Metadata } from "next";
import "./globals.css";
import SupabaseWarmup from "@/components/ui/SupabaseWarmup";

// 모든 페이지를 동적 렌더링으로 강제 (빌드 시 정적 생성 안 함)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "한국유소년체스연맹 - 인재 육성의 중심",
  description:
    "한국유소년체스연맹는 증명서 발급, 교육과정, 행사 정보를 제공하는 공식 플랫폼입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <SupabaseWarmup />
        {children}
      </body>
    </html>
  );
}
