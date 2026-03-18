/**
 * 폰트 경로 설정
 *
 * 한국어 PDF 생성을 위해 NotoSansKR 폰트를 사용합니다.
 * 아래 경로에 폰트 파일을 배치해야 합니다:
 *
 * public/fonts/NotoSansKR-Regular.ttf
 * public/fonts/NotoSansKR-Bold.ttf
 *
 * 다운로드: https://fonts.google.com/noto/specimen/Noto+Sans+KR
 * Google Fonts에서 NotoSansKR을 다운로드한 후
 * Regular(400)과 Bold(700) TTF 파일을 public/fonts/ 디렉토리에 배치하세요.
 */

import path from "path";

// 프로젝트 루트 기준 폰트 경로
const FONTS_DIR = path.join(process.cwd(), "public", "fonts");

export const FONT_PATHS = {
  regular: path.join(FONTS_DIR, "NotoSansKR-Regular.ttf"),
  bold: path.join(FONTS_DIR, "NotoSansKR-Bold.ttf"),
} as const;

export const FONT_FAMILY = "NotoSansKR";
