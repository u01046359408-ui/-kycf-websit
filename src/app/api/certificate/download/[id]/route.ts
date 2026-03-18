/**
 * 증명서 다운로드 API
 * GET /api/certificate/download/[id]
 *
 * 증명서 PDF를 다운로드합니다.
 * - 본인 또는 관리자만 접근 가능
 * - Storage에 PDF가 있으면 반환
 * - 없으면 실시간 생성 후 저장하고 반환
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  generateCertificatePDF,
  uploadPDF,
  downloadPDF,
  fileExists,
} from "@/lib/pdf";
import { CERTIFICATE_INFO } from "@/constants/certificates";
import type { Certificate, CertificateType, CertificateTemplate } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 증명서 정보 조회
    const { data: certificate, error: certError } = await supabase
      .from("certificates")
      .select("*, certificate_templates(*)")
      .eq("id", id)
      .single<Certificate & { certificate_templates: CertificateTemplate }>();

    if (certError || !certificate) {
      return NextResponse.json(
        { error: "증명서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 접근 권한 확인 (본인 또는 관리자)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isOwner = certificate.user_id === user.id;
    const isAdmin = profile?.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    let pdfBuffer: Buffer;

    // Storage에 PDF가 이미 존재하는지 확인
    if (certificate.pdf_url && (await fileExists(certificate.pdf_url))) {
      // 기존 PDF 다운로드
      pdfBuffer = await downloadPDF(certificate.pdf_url);
    } else {
      // PDF 실시간 생성
      const certificateType =
        certificate.certificate_templates.type as CertificateType;

      pdfBuffer = await generateCertificatePDF({
        certificateType,
        applicantName: certificate.applicant_name,
        applicantBirthDate: certificate.applicant_birth_date,
        serialNumber: certificate.serial_number,
        issuedAt: certificate.issued_at,
        purpose: certificate.purpose,
      });

      // 생성된 PDF를 Storage에 저장
      const fileName = `${certificate.serial_number}.pdf`;
      const storagePath = await uploadPDF(pdfBuffer, fileName);

      // DB의 pdf_url 업데이트
      await supabase
        .from("certificates")
        .update({ pdf_url: storagePath })
        .eq("id", id);
    }

    // 파일명 생성 (한국어 파일명 인코딩)
    const certName =
      CERTIFICATE_INFO[
        certificate.certificate_templates.type as CertificateType
      ]?.name ?? "증명서";
    const rawFileName = `${certName}_${certificate.serial_number}.pdf`;
    const encodedFileName = encodeURIComponent(rawFileName);

    // PDF 응답 반환
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFileName}`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("[Download] PDF 다운로드 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
