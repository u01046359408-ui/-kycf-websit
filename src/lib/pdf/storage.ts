/**
 * Supabase Storage를 통한 PDF 파일 관리
 * 서버 전용 모듈
 */

import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "certificates";

/**
 * PDF 파일을 Supabase Storage에 업로드
 * @returns 업로드된 파일의 경로
 */
export async function uploadPDF(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const supabase = await createClient();

  const filePath = `pdfs/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: "application/pdf",
      upsert: true, // 같은 이름 파일이 있으면 덮어쓰기
    });

  if (error) {
    console.error("[Storage] PDF 업로드 실패:", error);
    throw new Error(`PDF 업로드 실패: ${error.message}`);
  }

  return filePath;
}

/**
 * Supabase Storage에서 PDF 파일 다운로드
 * @returns PDF 바이너리 데이터
 */
export async function downloadPDF(filePath: string): Promise<Buffer> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(filePath);

  if (error) {
    console.error("[Storage] PDF 다운로드 실패:", error);
    throw new Error(`PDF 다운로드 실패: ${error.message}`);
  }

  // Blob을 Buffer로 변환
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * 서명된 URL 생성 (임시 다운로드 링크)
 * @param expiresIn 만료 시간 (초), 기본 1시간
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error("[Storage] 서명된 URL 생성 실패:", error);
    throw new Error(`서명된 URL 생성 실패: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Storage에 파일 존재 여부 확인
 */
export async function fileExists(filePath: string): Promise<boolean> {
  const supabase = await createClient();

  const dir = filePath.substring(0, filePath.lastIndexOf("/"));
  const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(dir, { search: fileName });

  if (error) {
    return false;
  }

  return data.some((file) => file.name === fileName);
}
