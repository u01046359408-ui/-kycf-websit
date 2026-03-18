"use client";

import { useState } from "react";
import { Home, Map, LogIn, UserPlus, Search, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="w-full bg-[#0a1628] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
        {/* Left links */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors duration-200"
          >
            <Home className="w-3 h-3" />
            <span>HOME</span>
          </Link>
          <Link
            href="/sitemap"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors duration-200"
          >
            <Map className="w-3 h-3" />
            <span>사이트맵</span>
          </Link>
        </div>

        {/* Right links */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어 입력"
                className="w-32 h-5 pl-2 pr-6 text-xs bg-white/5 border border-white/10 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:bg-white/10 transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c9a84c] transition-colors"
                aria-label="검색"
              >
                <Search className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* English */}
          <Link
            href="#"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors duration-200"
          >
            <Globe className="w-3 h-3" />
            <span>ENGLISH</span>
          </Link>

          <span className="w-px h-3 bg-white/10" />

          <Link
            href="/login"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors duration-200"
          >
            <LogIn className="w-3 h-3" />
            <span>로그인</span>
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors duration-200"
          >
            <UserPlus className="w-3 h-3" />
            <span>회원가입</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
