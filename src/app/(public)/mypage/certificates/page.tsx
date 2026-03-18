"use client";

import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Certificate } from "@/types";

interface CertificateWithTemplate extends Certificate {
  template?: { name: string };
}

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateWithTemplate[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("certificates")
          .select(
            "*, template:certificate_templates!certificates_template_id_fkey(name)"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setCertificates(data ?? []);
      } catch (err) {
        console.error("증명서 목록 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [supabase]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-bold text-white">발급 내역</h3>
        <p className="text-sm text-gray-400 mt-1">
          총 {certificates.length}건의 증명서가 발급되었습니다.
        </p>
      </div>

      {certificates.length > 0 ? (
        <>
          {/* 데스크톱 테이블 */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    일련번호
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    증명서명
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    발급일
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    다운로드
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {certificates.map((cert) => (
                  <tr
                    key={cert.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-white font-mono">
                      {cert.serial_number}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white font-medium">
                        {cert.template?.name ?? "-"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {cert.purpose}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {formatDate(cert.issued_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        발급완료
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {cert.pdf_url ? (
                        <a
                          href={`/api/certificate/download/${cert.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#c9a84c] bg-[#c9a84c]/10 rounded-lg hover:bg-[#c9a84c]/20 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 */}
          <div className="sm:hidden divide-y divide-white/5">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white font-medium">
                      {cert.template?.name ?? "-"}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {cert.serial_number}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    발급완료
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {formatDate(cert.issued_at)}
                  </span>
                  {cert.pdf_url ? (
                    <a
                      href={`/api/certificate/download/${cert.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#c9a84c] bg-[#c9a84c]/10 rounded-lg hover:bg-[#c9a84c]/20 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">발급된 증명서가 없습니다.</p>
          <p className="text-sm text-gray-500 mt-1">
            증명서를 신청하면 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
