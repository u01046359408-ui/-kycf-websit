"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

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

// 모듈 레벨 캐시 — 같은 사용자 ID면 profiles 재조회 방지
let profileCache: { id: string; name: string | null; role: string } | null = null;

/**
 * 클라이언트 컴포넌트에서 사용할 인증 훅
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const initializedRef = useRef(false);

  const fetchProfile = useCallback(
    async (authUser: User): Promise<AuthUser> => {
      // 캐시된 프로필이 같은 유저면 재사용
      if (profileCache && profileCache.id === authUser.id) {
        return {
          id: authUser.id,
          email: authUser.email!,
          name: profileCache.name,
          role: profileCache.role,
        };
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", authUser.id)
        .single();

      const name = profile?.name || authUser.user_metadata?.name || null;
      const role = profile?.role || "user";

      // 캐시 저장
      profileCache = { id: authUser.id, name, role };

      return {
        id: authUser.id,
        email: authUser.email!,
        name,
        role,
      };
    },
    [supabase]
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // 초기 로드: getSession으로 빠르게 확인 (로컬 캐시 사용)
    const getInitialUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const mapped = await fetchProfile(session.user);
          setUser(mapped);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_OUT") {
        profileCache = null;
        setUser(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        try {
          // SIGNED_IN 이벤트면 캐시 무효화
          if (event === "SIGNED_IN") {
            profileCache = null;
          }
          const mapped = await fetchProfile(session.user);
          setUser(mapped);
        } catch {
          // 에러 무시
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // 탭이 다시 활성화되면 세션 확인 (장시간 방치 후 복귀 대응)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const mapped = await fetchProfile(session.user);
          setUser(mapped);
        } else {
          profileCache = null;
          setUser(null);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [supabase, fetchProfile]);

  const handleSignOut = useCallback(async () => {
    profileCache = null;
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  }, [supabase]);

  return {
    user,
    loading,
    signOut: handleSignOut,
  };
}
