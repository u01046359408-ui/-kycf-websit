import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageBannerProps {
  title: string;
  breadcrumb: BreadcrumbItem[];
}

export default function PageBanner({ title, breadcrumb }: PageBannerProps) {
  return (
    <section className="relative w-full bg-gradient-to-r from-[#1B2A4A] to-[#243557] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,1) 10px, rgba(255,255,255,1) 11px)`,
        }}
      />
      <div className="relative max-w-[1200px] mx-auto px-6 py-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {title}
        </h1>
        <nav aria-label="브레드크럼" className="mt-3 flex items-center gap-1.5 text-sm text-white/70">
          {breadcrumb.map((item, index) => (
            <span key={item.href} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/40" />}
              {index === breadcrumb.length - 1 ? (
                <span className="text-[#C5963A] font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-white transition-colors duration-200">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
