/**
 * 증명서 발급 API
 * POST /api/certificate/issue
 *
 * 결제 완료 후 호출하여 증명서를 발급합니다.
 * - 결제 정보 확인
 * - 일련번호 생성
 * - PDF 생성 및 Storage 업로드
 * - certificates 테이블에 레코드 생성
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  generateCertificatePDF,
  generateSerialNumber,
  uploadPDF,
} from "@/lib/pdf";
import type { CertificateType, Payment, CertificateTemplate } from "@/types";

interface IssueRequestBody {
  payment_id: string;
  applicant_name: string;
  applicant_birth_date: string;
  applicant_phone: string;
  purpose: string;
}

export async function POST(request: NextRequest) {
  try {
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

    // 요청 본문 파싱
    const body: IssueRequestBody = await request.json();

    if (
      !body.payment_id ||
      !body.applicant_name ||
      !body.applicant_birth_date ||
      !body.purpose
    ) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    // 결제 정보 확인
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*, certificate_templates(*)")
      .eq("id", body.payment_id)
      .single<Payment & { certificate_templates: CertificateTemplate }>();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: "결제 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 결제 상태 확인
    if (payment.status !== "completed") {
      return NextResponse.json(
        { error: "결제가 완료되지 않았습니다." },
        { status: 400 }
      );
    }

    // 결제 소유자 확인
    if (payment.user_id !== user.id) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 이미 발급된 증명서가 있는지 확인
    const { data: existingCert } = await supabase
      .from("certificates")
      .select("id")
      .eq("payment_id", body.payment_id)
      .single();

    if (existingCert) {
      return NextResponse.json(
        { error: "이미 발급된 증명서가 있습니다." },
        { status: 409 }
      );
    }

    // 일련번호 생성 (오늘 발급된 증명서 수 기반)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const { count } = await supabase
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${todayStr}T00:00:00`)
      .lt("created_at", `${todayStr}T23:59:59.999`);

    const serialNumber = generateSerialNumber((count ?? 0) + 1);

    // 증명서 종류 파악
    const certificateType =
      payment.certificate_templates.type as CertificateType;

    // 회원 성적/자격 데이터 조회 (user_id + record_type 기반)
    let recordData: Record<string, unknown> | undefined;
    const { data: memberRecord } = await supabase
      .from("member_records")
      .select("data")
      .eq("user_id", user.id)
      .eq("record_type", certificateType)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (memberRecord?.data) {
      recordData = memberRecord.data as Record<string, unknown>;
    }

    // PDF 생성
    const pdfBuffer = await generateCertificatePDF({
      certificateType,
      applicantName: body.applicant_name,
      applicantBirthDate: body.applicant_birth_date,
      serialNumber,
      issuedAt: todayStr,
      purpose: body.purpose,
      recordData,
    });

    // PDF를 Supabase Storage에 업로드
    const fileName = `${serialNumber}.pdf`;
    const storagePath = await uploadPDF(pdfBuffer, fileName);

    // certificates 테이블에 레코드 생성
    const { data: certificate, error: insertError } = await supabase
      .from("certificates")
      .insert({
        user_id: user.id,
        payment_id: body.payment_id,
        template_id: payment.certificate_template_id,
        serial_number: serialNumber,
        applicant_name: body.applicant_name,
        applicant_birth_date: body.applicant_birth_date,
        applicant_phone: body.applicant_phone || "",
        purpose: body.purpose,
        pdf_url: storagePath,
        record_data: recordData ?? null,
        issued_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Issue] 증명서 레코드 생성 실패:", insertError);
      return NextResponse.json(
        { error: "증명서 발급에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        serial_number: certificate.serial_number,
        pdf_url: storagePath,
      },
    });
  } catch (error) {
    console.error("[Issue] 증명서 발급 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
