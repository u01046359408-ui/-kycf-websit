/**
 * PDF 증명서 생성 모듈
 * 서버 전용 - 클라이언트에서 호출 불가
 */

import PDFDocument from "pdfkit";
import fs from "fs";
import { FONT_PATHS, FONT_FAMILY } from "./fonts";
import { CERTIFICATE_INFO } from "@/constants/certificates";
import type { CertificateType } from "@/types";

// PDF 생성에 필요한 입력 데이터
export interface CertificatePDFData {
  certificateType: CertificateType;
  applicantName: string;
  applicantBirthDate: string;
  serialNumber: string;
  issuedAt: string;
  purpose: string;
  // 회원 성적/자격 데이터 (없으면 기본 텍스트 표시)
  recordData?: Record<string, unknown>;
}

// A4 사이즈 상수 (포인트 단위, 1pt = 1/72 inch)
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 60;
const CONTENT_WIDTH = A4_WIDTH - MARGIN * 2;

/**
 * 폰트 등록 여부 확인 및 등록
 * 폰트 파일이 없으면 기본 내장 폰트로 대체 (한국어 깨짐 가능)
 */
function registerFonts(doc: PDFKit.PDFDocument): boolean {
  const regularExists = fs.existsSync(FONT_PATHS.regular);
  const boldExists = fs.existsSync(FONT_PATHS.bold);

  if (regularExists && boldExists) {
    doc.registerFont(`${FONT_FAMILY}-Regular`, FONT_PATHS.regular);
    doc.registerFont(`${FONT_FAMILY}-Bold`, FONT_PATHS.bold);
    return true;
  }

  // 폰트 파일이 없는 경우 경고 로그
  console.warn(
    "[PDF] 한국어 폰트 파일을 찾을 수 없습니다. public/fonts/ 디렉토리에 NotoSansKR 폰트를 배치하세요."
  );
  return false;
}

/**
 * 날짜 문자열을 한국어 형식으로 변환
 * 예: "2026-03-17" -> "2026년 03월 17일"
 */
function formatDateKorean(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 구분선 그리기
 */
function drawDivider(
  doc: PDFKit.PDFDocument,
  y: number,
  options?: { color?: string; width?: number }
) {
  const color = options?.color ?? "#333333";
  const width = options?.width ?? 1;
  doc
    .moveTo(MARGIN, y)
    .lineTo(A4_WIDTH - MARGIN, y)
    .strokeColor(color)
    .lineWidth(width)
    .stroke();
}

/**
 * 정보 행 그리기 (라벨: 값 형식)
 */
function drawInfoRow(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string,
  y: number,
  hasFonts: boolean
): number {
  const labelFont = hasFonts ? `${FONT_FAMILY}-Bold` : "Helvetica-Bold";
  const valueFont = hasFonts ? `${FONT_FAMILY}-Regular` : "Helvetica";

  doc
    .font(labelFont)
    .fontSize(12)
    .fillColor("#555555")
    .text(label, MARGIN + 20, y, { width: 120, align: "left" });

  doc
    .font(valueFont)
    .fontSize(12)
    .fillColor("#222222")
    .text(value, MARGIN + 150, y, {
      width: CONTENT_WIDTH - 170,
      align: "left",
    });

  return y + 30;
}

// ============================================
// 증명서 종류별 recordData 렌더링 함수
// ============================================

/** 자격증명서 데이터 렌더링 */
function renderQualificationData(
  doc: PDFKit.PDFDocument,
  data: Record<string, unknown>,
  y: number,
  hasFonts: boolean
): number {
  const rows: [string, string][] = [
    ["자 격 증 명", String(data.qualification_name ?? "-")],
    ["자 격 번 호", String(data.qualification_number ?? "-")],
    ["취 득 일 자", data.qualification_date ? formatDateKorean(String(data.qualification_date)) : "-"],
    ["점       수", data.score != null ? `${data.score}점` : "-"],
    ["등       급", String(data.grade ?? "-")],
    ["발 급 기 관", String(data.issuer ?? "-")],
  ];

  for (const [label, value] of rows) {
    y = drawInfoRow(doc, label, value, y, hasFonts);
  }

  return y;
}

/** 성적증명서 데이터 렌더링 (테이블 포함) */
function renderTranscriptData(
  doc: PDFKit.PDFDocument,
  data: Record<string, unknown>,
  y: number,
  hasFonts: boolean
): number {
  const boldFont = hasFonts ? `${FONT_FAMILY}-Bold` : "Helvetica-Bold";
  const regularFont = hasFonts ? `${FONT_FAMILY}-Regular` : "Helvetica";

  // 과정명
  y = drawInfoRow(doc, "과  정  명", String(data.course_name ?? "-"), y, hasFonts);
  y += 10;

  // 과목별 성적 소제목
  doc
    .font(boldFont)
    .fontSize(11)
    .fillColor("#1a365d")
    .text("[과목별 성적]", MARGIN + 20, y);
  y += 20;

  const subjects = Array.isArray(data.subjects) ? data.subjects : [];
  const totalScore = data.total_score;
  const average = data.average;
  const rank = data.rank;

  // 테이블 설정
  const tableX = MARGIN + 20;
  const tableWidth = CONTENT_WIDTH - 40;
  const col1Width = tableWidth * 0.55; // 과목명
  const col2Width = tableWidth * 0.25; // 점수
  const col3Width = tableWidth * 0.20; // 등급
  const rowHeight = 25;

  const drawTableLine = (x1: number, y1: number, x2: number, y2: number) => {
    doc.moveTo(x1, y1).lineTo(x2, y2).strokeColor("#333333").lineWidth(0.5).stroke();
  };

  // 테이블 헤더 배경
  doc.rect(tableX, y, tableWidth, rowHeight).fillColor("#e2e8f0").fill();

  // 헤더 텍스트
  doc.font(boldFont).fontSize(10).fillColor("#1a365d");
  doc.text("과 목 명", tableX, y + 7, { width: col1Width, align: "center" });
  doc.text("점수", tableX + col1Width, y + 7, { width: col2Width, align: "center" });
  doc.text("등급", tableX + col1Width + col2Width, y + 7, { width: col3Width, align: "center" });

  // 헤더 테두리 상단
  drawTableLine(tableX, y, tableX + tableWidth, y);
  // 헤더 테두리 하단
  drawTableLine(tableX, y + rowHeight, tableX + tableWidth, y + rowHeight);

  y += rowHeight;

  // 데이터 행
  doc.font(regularFont).fontSize(10).fillColor("#222222");
  for (const subject of subjects) {
    const subj = subject as { name?: string; score?: number; grade?: string };
    doc.text(String(subj.name ?? "-"), tableX + 5, y + 7, { width: col1Width - 10, align: "left" });
    doc.text(subj.score != null ? String(subj.score) : "-", tableX + col1Width, y + 7, { width: col2Width, align: "center" });
    doc.text(String(subj.grade ?? "-"), tableX + col1Width + col2Width, y + 7, { width: col3Width, align: "center" });
    y += rowHeight;
    drawTableLine(tableX, y, tableX + tableWidth, y);
  }

  // 요약 행: 총점
  doc.rect(tableX, y, tableWidth, rowHeight).fillColor("#f7fafc").fill();
  doc.font(boldFont).fontSize(10).fillColor("#333333");
  doc.text("총    점", tableX + 5, y + 7, { width: col1Width - 10, align: "left" });
  doc.text(totalScore != null ? String(totalScore) : "-", tableX + col1Width, y + 7, { width: col2Width, align: "center" });
  doc.text("", tableX + col1Width + col2Width, y + 7, { width: col3Width, align: "center" });
  y += rowHeight;
  drawTableLine(tableX, y, tableX + tableWidth, y);

  // 요약 행: 평균
  doc.rect(tableX, y, tableWidth, rowHeight).fillColor("#f7fafc").fill();
  doc.font(boldFont).fontSize(10).fillColor("#333333");
  doc.text("평    균", tableX + 5, y + 7, { width: col1Width - 10, align: "left" });
  doc.text(average != null ? String(average) : "-", tableX + col1Width, y + 7, { width: col2Width, align: "center" });
  doc.text("", tableX + col1Width + col2Width, y + 7, { width: col3Width, align: "center" });
  y += rowHeight;
  drawTableLine(tableX, y, tableX + tableWidth, y);

  // 요약 행: 석차
  doc.rect(tableX, y, tableWidth, rowHeight).fillColor("#f7fafc").fill();
  doc.font(boldFont).fontSize(10).fillColor("#333333");
  doc.text("석    차", tableX + 5, y + 7, { width: col1Width - 10, align: "left" });
  doc.text("", tableX + col1Width, y + 7, { width: col2Width, align: "center" });
  doc.text(rank != null ? String(rank) : "-", tableX + col1Width + col2Width, y + 7, { width: col3Width, align: "center" });
  y += rowHeight;
  drawTableLine(tableX, y, tableX + tableWidth, y);

  // 세로선 (전체 테이블)
  const tableTop = y - rowHeight * (subjects.length + 4); // 헤더 + 과목 + 3개 요약
  drawTableLine(tableX, tableTop, tableX, y);
  drawTableLine(tableX + col1Width, tableTop, tableX + col1Width, y);
  drawTableLine(tableX + col1Width + col2Width, tableTop, tableX + col1Width + col2Width, y);
  drawTableLine(tableX + tableWidth, tableTop, tableX + tableWidth, y);

  return y + 10;
}

/** 경력증명서 데이터 렌더링 */
function renderCareerData(
  doc: PDFKit.PDFDocument,
  data: Record<string, unknown>,
  y: number,
  hasFonts: boolean
): number {
  const rows: [string, string][] = [
    ["근 무 기 관", String(data.organization ?? "-")],
    ["직       위", String(data.position ?? "-")],
    ["소 속 부 서", String(data.department ?? "-")],
    ["근무시작일", data.start_date ? formatDateKorean(String(data.start_date)) : "-"],
    ["근무종료일", data.end_date ? formatDateKorean(String(data.end_date)) : "-"],
    ["담 당 업 무", String(data.duties ?? "-")],
  ];

  for (const [label, value] of rows) {
    y = drawInfoRow(doc, label, value, y, hasFonts);
  }

  return y;
}

/** 수료증명서 데이터 렌더링 */
function renderCompletionData(
  doc: PDFKit.PDFDocument,
  data: Record<string, unknown>,
  y: number,
  hasFonts: boolean
): number {
  const rows: [string, string][] = [
    ["교육과정명", String(data.course_name ?? "-")],
    ["교 육 기 간", String(data.course_period ?? "-")],
    ["수 료 일 자", data.completion_date ? formatDateKorean(String(data.completion_date)) : "-"],
    ["점       수", data.score != null ? `${data.score}점` : "-"],
    ["담당강사명", String(data.instructor ?? "-")],
  ];

  for (const [label, value] of rows) {
    y = drawInfoRow(doc, label, value, y, hasFonts);
  }

  return y;
}

/** 재직증명서 데이터 렌더링 */
function renderEmploymentData(
  doc: PDFKit.PDFDocument,
  data: Record<string, unknown>,
  y: number,
  hasFonts: boolean
): number {
  const rows: [string, string][] = [
    ["소 속 기 관", String(data.organization ?? "-")],
    ["직       위", String(data.position ?? "-")],
    ["소 속 부 서", String(data.department ?? "-")],
    ["입 사 일 자", data.start_date ? formatDateKorean(String(data.start_date)) : "-"],
    ["담 당 업 무", String(data.duties ?? "-")],
  ];

  for (const [label, value] of rows) {
    y = drawInfoRow(doc, label, value, y, hasFonts);
  }

  return y;
}

/** 교육이수증명서 데이터 렌더링 */
function renderEducationData(
  doc: PDFKit.PDFDocument,
  data: Record<string, unknown>,
  y: number,
  hasFonts: boolean
): number {
  const rows: [string, string][] = [
    ["프로그램명", String(data.program_name ?? "-")],
    ["총 이수시간", data.total_hours != null ? `${data.total_hours}시간` : "-"],
    ["이 수 일 자", data.completion_date ? formatDateKorean(String(data.completion_date)) : "-"],
    ["점       수", data.score != null ? `${data.score}점` : "-"],
    ["담당강사명", String(data.instructor ?? "-")],
  ];

  for (const [label, value] of rows) {
    y = drawInfoRow(doc, label, value, y, hasFonts);
  }

  return y;
}

/**
 * recordData를 증명서 종류에 맞게 렌더링
 * recordData가 없거나 빈 객체면 null 반환 (기존 텍스트 사용)
 */
function renderRecordData(
  doc: PDFKit.PDFDocument,
  certificateType: CertificateType,
  recordData: Record<string, unknown> | undefined,
  y: number,
  hasFonts: boolean
): number | null {
  if (!recordData || Object.keys(recordData).length === 0) {
    return null;
  }

  const renderers: Record<
    CertificateType,
    (doc: PDFKit.PDFDocument, data: Record<string, unknown>, y: number, hasFonts: boolean) => number
  > = {
    qualification: renderQualificationData,
    transcript: renderTranscriptData,
    career: renderCareerData,
    completion: renderCompletionData,
    employment: renderEmploymentData,
    education: renderEducationData,
  };

  const renderer = renderers[certificateType];
  if (!renderer) {
    return null;
  }

  return renderer(doc, recordData, y, hasFonts);
}

/**
 * 증명서 PDF를 생성하여 Buffer로 반환
 */
export async function generateCertificatePDF(
  data: CertificatePDFData
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        info: {
          Title: `${CERTIFICATE_INFO[data.certificateType].name} - ${data.applicantName}`,
          Author: "한국유소년체스연맹",
          Subject: CERTIFICATE_INFO[data.certificateType].name,
          Creator: "한국유소년체스연맹 증명서 발급 시스템",
        },
      });

      // Buffer로 수집
      const chunks: Uint8Array[] = [];
      doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // 한국어 폰트 등록
      const hasFonts = registerFonts(doc);
      const boldFont = hasFonts ? `${FONT_FAMILY}-Bold` : "Helvetica-Bold";
      const regularFont = hasFonts
        ? `${FONT_FAMILY}-Regular`
        : "Helvetica";

      const certInfo = CERTIFICATE_INFO[data.certificateType];

      // === 외곽 테두리 ===
      doc
        .rect(30, 30, A4_WIDTH - 60, A4_HEIGHT - 60)
        .strokeColor("#1a365d")
        .lineWidth(2)
        .stroke();

      // 내부 테두리
      doc
        .rect(35, 35, A4_WIDTH - 70, A4_HEIGHT - 70)
        .strokeColor("#bee3f8")
        .lineWidth(0.5)
        .stroke();

      // === 상단: 기관명 ===
      let currentY = 70;

      doc
        .font(boldFont)
        .fontSize(14)
        .fillColor("#1a365d")
        .text("한국유소년체스연맹", MARGIN, currentY, {
          width: CONTENT_WIDTH,
          align: "center",
        });

      currentY += 30;

      doc
        .font(regularFont)
        .fontSize(9)
        .fillColor("#666666")
        .text("DAEHAN TALENT DEVELOPMENT INSTITUTE", MARGIN, currentY, {
          width: CONTENT_WIDTH,
          align: "center",
        });

      currentY += 30;

      // 상단 구분선
      drawDivider(doc, currentY, { color: "#1a365d", width: 2 });
      currentY += 5;
      drawDivider(doc, currentY, { color: "#1a365d", width: 0.5 });

      // === 제목: 증명서 종류 ===
      currentY += 40;

      doc
        .font(boldFont)
        .fontSize(32)
        .fillColor("#1a365d")
        .text(certInfo.name, MARGIN, currentY, {
          width: CONTENT_WIDTH,
          align: "center",
        });

      currentY += 60;

      // 제목 아래 영문
      doc
        .font(regularFont)
        .fontSize(10)
        .fillColor("#999999")
        .text(`Certificate of ${data.certificateType.charAt(0).toUpperCase() + data.certificateType.slice(1)}`, MARGIN, currentY, {
          width: CONTENT_WIDTH,
          align: "center",
        });

      currentY += 40;

      // 얇은 구분선
      drawDivider(doc, currentY, { color: "#cccccc", width: 0.5 });

      // === 본문: 신청자 정보 ===
      currentY += 30;

      // 정보 영역 배경
      doc
        .rect(MARGIN + 10, currentY - 10, CONTENT_WIDTH - 20, 170)
        .fillColor("#f7fafc")
        .fill();

      currentY = drawInfoRow(
        doc,
        "성       명",
        data.applicantName,
        currentY,
        hasFonts
      );
      currentY = drawInfoRow(
        doc,
        "생 년 월 일",
        formatDateKorean(data.applicantBirthDate),
        currentY,
        hasFonts
      );
      currentY = drawInfoRow(
        doc,
        "증 명 서 류",
        certInfo.name,
        currentY,
        hasFonts
      );
      currentY = drawInfoRow(
        doc,
        "발 급 목 적",
        data.purpose,
        currentY,
        hasFonts
      );
      currentY = drawInfoRow(
        doc,
        "일 련 번 호",
        data.serialNumber,
        currentY,
        hasFonts
      );

      currentY += 20;

      // === 증명 내용 ===
      drawDivider(doc, currentY, { color: "#cccccc", width: 0.5 });
      currentY += 25;

      doc
        .font(boldFont)
        .fontSize(13)
        .fillColor("#1a365d")
        .text("증명 내용", MARGIN + 20, currentY);

      currentY += 30;

      // recordData가 있으면 실제 데이터 렌더링, 없으면 기존 설명문 표시
      const recordEndY = renderRecordData(
        doc,
        data.certificateType,
        data.recordData,
        currentY,
        hasFonts
      );

      if (recordEndY !== null) {
        // recordData 렌더링 성공
        currentY = recordEndY;
      } else {
        // 기존 방식: 하드코딩 설명문 표시
        doc
          .font(regularFont)
          .fontSize(11)
          .fillColor("#333333")
          .text(certInfo.details, MARGIN + 20, currentY, {
            width: CONTENT_WIDTH - 40,
            align: "justify",
            lineGap: 6,
          });

        currentY += 100;
      }

      // === 발급 확인문 ===
      currentY += 20;

      doc
        .font(regularFont)
        .fontSize(11)
        .fillColor("#333333")
        .text(
          "위 사항이 틀림없음을 증명합니다.",
          MARGIN,
          currentY,
          {
            width: CONTENT_WIDTH,
            align: "center",
          }
        );

      // === 하단: 발급일자 ===
      currentY = A4_HEIGHT - 250;

      doc
        .font(regularFont)
        .fontSize(13)
        .fillColor("#333333")
        .text(formatDateKorean(data.issuedAt), MARGIN, currentY, {
          width: CONTENT_WIDTH,
          align: "center",
        });

      currentY += 50;

      // === 직인 영역 ===
      doc
        .font(boldFont)
        .fontSize(16)
        .fillColor("#1a365d")
        .text("한국유소년체스연맹장", MARGIN, currentY, {
          width: CONTENT_WIDTH,
          align: "center",
        });

      currentY += 30;

      // 직인 표시 (원형 테두리 + 텍스트)
      const sealCenterX = A4_WIDTH / 2 + 80;
      const sealCenterY = currentY + 10;
      const sealRadius = 30;

      doc
        .circle(sealCenterX, sealCenterY, sealRadius)
        .strokeColor("#cc0000")
        .lineWidth(2)
        .stroke();

      doc
        .font(boldFont)
        .fontSize(8)
        .fillColor("#cc0000")
        .text("한국유소년체스연맹", sealCenterX - 18, sealCenterY - 12, {
          width: 36,
          align: "center",
        });

      doc
        .font(boldFont)
        .fontSize(8)
        .fillColor("#cc0000")
        .text("개발원", sealCenterX - 18, sealCenterY, {
          width: 36,
          align: "center",
        });

      doc
        .font(boldFont)
        .fontSize(6)
        .fillColor("#cc0000")
        .text("(인)", sealCenterX - 18, sealCenterY + 12, {
          width: 36,
          align: "center",
        });

      // === 하단 구분선 ===
      const bottomLineY = A4_HEIGHT - 100;
      drawDivider(doc, bottomLineY, { color: "#1a365d", width: 0.5 });
      drawDivider(doc, bottomLineY + 3, { color: "#1a365d", width: 2 });

      // === 바닥글 ===
      doc
        .font(regularFont)
        .fontSize(8)
        .fillColor("#888888")
        .text(
          "본 증명서는 한국유소년체스연맹에서 발급한 공식 문서입니다.",
          MARGIN,
          bottomLineY + 15,
          {
            width: CONTENT_WIDTH,
            align: "center",
          }
        );

      doc
        .font(regularFont)
        .fontSize(7)
        .fillColor("#aaaaaa")
        .text(
          `검증 URL: ${process.env.NEXT_PUBLIC_APP_URL || "https://daehan-talent.com"}/verify/${data.serialNumber}`,
          MARGIN,
          bottomLineY + 30,
          {
            width: CONTENT_WIDTH,
            align: "center",
          }
        );

      // PDF 문서 종료
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 증명서 일련번호 생성
 * 형식: CERT-YYYYMMDD-NNNNNN
 */
export function generateSerialNumber(sequence: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const seq = String(sequence).padStart(6, "0");
  return `CERT-${year}${month}${day}-${seq}`;
}
