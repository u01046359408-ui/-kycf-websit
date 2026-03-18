/**
 * 증명서 검증 API
 * GET /api/certificate/verify/[serialNumber]
 *
 * 증명서의 진위를 확인하는 공개 API입니다.
 * - 일련번호로 DB 조회
 * - 인증 불필요 (누구나 검증 가능)
 * - 민감 정보 제외하고 발급 정보만 반환
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CERTIFICATE_INFO } from "@/constants/certificates";
import type { CertificateType, Certificate, CertificateTemplate } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serialNumber: string }> }
) {
  try {
    const { serialNumber } = await params;
    const supabase = await createClient();

    // 일련번호 형식 검증
    const serialPattern = /^CERT-\d{8}-\d{6}$/;
    if (!serialPattern.test(serialNumber)) {
      return NextResponse.json(
        { valid: false, error: "잘못된 일련번호 형식입니다." },
        { status: 400 }
      );
    }

    // 일련번호로 증명서 조회
    const { data: certificate, error } = await supabase
      .from("certificates")
      .select("*, certificate_templates(*)")
      .eq("serial_number", serialNumber)
      .single<Certificate & { certificate_templates: CertificateTemplate }>();

    if (error || !certificate) {
      return NextResponse.json(
        {
          valid: false,
          error: "해당 일련번호의 증명서를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // 이름 마스킹 (예: 홍길동 -> 홍*동)
    const maskedName = maskName(certificate.applicant_name);

    // 증명서 종류명
    const certificateType =
      certificate.certificate_templates.type as CertificateType;
    const certName =
      CERTIFICATE_INFO[certificateType]?.name ?? "증명서";

    return NextResponse.json({
      valid: true,
      certificate: {
        serial_number: certificate.serial_number,
        certificate_type: certName,
        applicant_name: maskedName,
        issued_at: certificate.issued_at,
        issuer: "대한인재개발원",
      },
    });
  } catch (error) {
    console.error("[Verify] 증명서 검증 오류:", error);
    return NextResponse.json(
      { valid: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * 이름 마스킹 처리
 * 2글자: 첫 글자만 표시 (예: 김* )
 * 3글자 이상: 첫/끝 글자만 표시 (예: 홍*동)
 */
function maskName(name: string): string {
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + "*";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}
