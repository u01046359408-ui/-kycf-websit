"use client";

const partners = [
  { name: "교육부" },
  { name: "문화체육관광부" },
  { name: "대한체육회" },
  { name: "국민체육진흥공단" },
  { name: "한국기원" },
  { name: "대한장기협회" },
  { name: "대한체스협회" },
  { name: "한국두뇌스포츠연맹" },
];

export default function PartnersSection() {
  const duplicated = [...partners, ...partners];

  return (
    <section className="bg-white py-12 border-t border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Title */}
        <p className="text-sm text-gray-500 text-center mb-8">유관기관</p>

        {/* Auto-scrolling row */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex items-center gap-8 animate-partner-scroll hover:[animation-play-state:paused]">
            {duplicated.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex-shrink-0 w-[160px] h-[70px] border border-gray-200 rounded bg-white flex items-center justify-center"
              >
                <span className="text-sm text-gray-400 font-medium">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes partnerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-partner-scroll {
          animation: partnerScroll 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
