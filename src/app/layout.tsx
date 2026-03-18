import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대한인재 - 인재 육성의 중심",
  description:
    "대한인재는 증명서 발급, 교육과정, 행사 정보를 제공하는 공식 플랫폼입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
