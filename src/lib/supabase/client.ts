import { createBrowserClient } from "@supabase/ssr";

// 빌드 시 프리렌더링에서 환경변수가 없을 수 있으므로 기본값 제공
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// 싱글턴 — 브라우저에서 하나의 인스턴스만 사용하여 세션 상태 일관성 유지
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;
  client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}
