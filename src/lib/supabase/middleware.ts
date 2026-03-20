import { NextResponse, type NextRequest } from "next/server";

// 미들웨어에서는 Supabase를 호출하지 않음 (속도 최적화)
// 권한 체크는 각 페이지의 클라이언트 컴포넌트에서 useAuth로 처리
export async function updateSession(request: NextRequest) {
  return NextResponse.next();
}
