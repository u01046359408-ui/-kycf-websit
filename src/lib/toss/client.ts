// 토스페이먼츠 서버 유틸리티 (서버에서만 사용)
// TOSS_SECRET_KEY는 절대 클라이언트에 노출하지 않음

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
const TOSS_API_BASE = "https://api.tosspayments.com/v1";

/**
 * 토스페이먼츠 API 호출을 위한 기본 인증 헤더 생성
 * Base64 인코딩된 시크릿 키 사용
 */
function getAuthHeaders() {
  if (!TOSS_SECRET_KEY) {
    throw new Error("TOSS_SECRET_KEY 환경변수가 설정되지 않았습니다.");
  }

  const encodedKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");

  return {
    Authorization: `Basic ${encodedKey}`,
    "Content-Type": "application/json",
  };
}

/**
 * 주문번호 생성 (형식: ORD-YYYYMMDD-XXXXXX)
 */
export function generateOrderId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${dateStr}-${random}`;
}

/**
 * 증명서 일련번호 생성 (형식: CERT-YYYYMMDD-XXXXXX)
 */
export function generateSerialNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CERT-${dateStr}-${random}`;
}

/**
 * 토스페이먼츠 결제 승인 API 호출
 * 서버에서만 호출 (시크릿 키 사용)
 */
export async function confirmPayment(params: {
  paymentKey: string;
  orderId: string;
  amount: number;
}) {
  const response = await fetch(`${TOSS_API_BASE}/payments/confirm`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      paymentKey: params.paymentKey,
      orderId: params.orderId,
      amount: params.amount,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new TossPaymentError(
      data.code || "UNKNOWN_ERROR",
      data.message || "결제 승인에 실패했습니다."
    );
  }

  return data;
}

/**
 * 토스페이먼츠 결제 취소 API 호출
 * 관리자 환불 처리용
 */
export async function cancelPayment(params: {
  paymentKey: string;
  cancelReason: string;
  cancelAmount?: number;
}) {
  const response = await fetch(
    `${TOSS_API_BASE}/payments/${params.paymentKey}/cancel`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        cancelReason: params.cancelReason,
        ...(params.cancelAmount && { cancelAmount: params.cancelAmount }),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new TossPaymentError(
      data.code || "UNKNOWN_ERROR",
      data.message || "결제 취소에 실패했습니다."
    );
  }

  return data;
}

/**
 * 토스페이먼츠 결제 조회 API 호출
 */
export async function getPayment(paymentKey: string) {
  const response = await fetch(
    `${TOSS_API_BASE}/payments/${paymentKey}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new TossPaymentError(
      data.code || "UNKNOWN_ERROR",
      data.message || "결제 조회에 실패했습니다."
    );
  }

  return data;
}

/**
 * 토스페이먼츠 에러 클래스
 */
export class TossPaymentError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "TossPaymentError";
  }
}
