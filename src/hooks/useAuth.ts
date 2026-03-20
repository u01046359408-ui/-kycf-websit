"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

/**
 * 클라이언트 컴포넌트에서 사용할 인증 훅
 * - 현재 사용자 정보 조회
 * - 인증 상태 변경 실시간 감지
 * - 로그아웃 함수 제공
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Supabase User 객체를 AuthUser로 변환
  const mapUser = useCallback(
    async (authUser: User | null): Promise<AuthUser | null> => {
      if (!authUser) return null;

      // profiles 테이블에서 추가 정보 조회
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", authUser.id)
        .single();

      return {
        id: authUser.id,
        email: authUser.email!,
        name: profile?.name || authUser.user_metadata?.name || null,
        role: profile?.role || "user",
      };
    },
    [supabase]
  );

  useEffect(() => {
    // 초기 사용자 정보 로드 (getSession은 로컬 캐시 사용으로 빠름)
    const getInitialUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const mapped = await mapUser(session?.user ?? null);
        setUser(mapped);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // 인증 상태 변경 리스너 등록
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const mapped = await mapUser(session?.user ?? null);
        setUser(mapped);
      } catch {
        // Lock broken 등 에러 무시
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, mapUser]);

  // 로그아웃 함수
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    // 서버 측 세션도 정리하기 위해 페이지 새로고침
    window.location.href = "/login";
  }, [supabase]);

  return {
    user,
    loading,
    signOut: handleSignOut,
  };
}
