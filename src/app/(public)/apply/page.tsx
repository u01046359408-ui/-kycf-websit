"use client";

import { useState } from "react";
import PageBanner from "@/components/layout/PageBanner";
import { Send, User, Phone, Mail, Calendar, Building, Trophy } from "lucide-react";

const mockEvents = [
  { id: "1", name: "2026 전국 인재발굴 대회" },
  { id: "2", name: "2026 청소년 리더십 챌린지" },
  { id: "3", name: "제15회 한국유소년체스연맹 평가대전" },
  { id: "4", name: "2026 국제 인재교류 프로그램" },
  { id: "5", name: "2026 하계 지도사 연수" },
];

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    phone: "",
    email: "",
    event: "",
    affiliation: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <PageBanner
          title="온라인 참가신청"
          breadcrumb={[
            { label: "홈", href: "/" },
            { label: "온라인 참가신청", href: "/apply" },
          ]}
        />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-[#1a2744]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c9a84c]/20 flex items-center justify-center">
              <Send className="w-7 h-7 text-[#c9a84c]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              신청이 완료되었습니다
            </h2>
            <p className="text-gray-400 mb-2">
              <span className="text-[#c9a84c] font-medium">{form.name}</span>
              님의 참가 신청이 접수되었습니다.
            </p>
            <p className="text-gray-500 text-sm">
              확인 메일이 {form.email}로 발송됩니다.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: "",
                  birthdate: "",
                  phone: "",
                  email: "",
                  event: "",
                  affiliation: "",
                });
              }}
              className="mt-8 inline-block px-6 py-2.5 text-sm font-medium text-gray-300 border border-white/10 rounded-xl hover:bg-white/5 transition-colors duration-200"
            >
              새로운 신청하기
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title="온라인 참가신청"
        breadcrumb={[
          { label: "홈", href: "/" },
          { label: "온라인 참가신청", href: "/apply" },
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#1a2744]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white">참가 정보 입력</h2>
            <p className="mt-2 text-sm text-gray-400">
              아래 항목을 정확히 기입해 주세요. 모든 항목은 필수입니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 text-[#c9a84c]" />
                이름
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="홍길동"
                className="w-full h-11 px-4 text-sm bg-[#0a1628]/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200"
              />
            </div>

            {/* 생년월일 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 text-[#c9a84c]" />
                생년월일
              </label>
              <input
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 text-sm bg-[#0a1628]/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200 [color-scheme:dark]"
              />
            </div>

            {/* 연락처 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Phone className="w-4 h-4 text-[#c9a84c]" />
                연락처
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="010-1234-5678"
                className="w-full h-11 px-4 text-sm bg-[#0a1628]/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200"
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 text-[#c9a84c]" />
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className="w-full h-11 px-4 text-sm bg-[#0a1628]/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200"
              />
            </div>

            {/* 참가종목 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Trophy className="w-4 h-4 text-[#c9a84c]" />
                참가종목
              </label>
              <select
                name="event"
                value={form.event}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 text-sm bg-[#0a1628]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="" disabled className="bg-[#1a2744] text-gray-400">
                  종목을 선택해 주세요
                </option>
                {mockEvents.map((evt) => (
                  <option
                    key={evt.id}
                    value={evt.id}
                    className="bg-[#1a2744] text-white"
                  >
                    {evt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 소속 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Building className="w-4 h-4 text-[#c9a84c]" />
                소속
              </label>
              <input
                type="text"
                name="affiliation"
                value={form.affiliation}
                onChange={handleChange}
                required
                placeholder="소속 단체 또는 기관명"
                className="w-full h-11 px-4 text-sm bg-[#0a1628]/60 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/30 transition-all duration-200"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-12 flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#d4b85c] text-[#0a1628] font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-[#c9a84c]/20"
              >
                <Send className="w-4 h-4" />
                신청하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
