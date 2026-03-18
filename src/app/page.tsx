import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import QuickMenu from "@/components/landing/QuickMenu";
import ContentSection from "@/components/landing/ContentSection";
import PartnersSection from "@/components/landing/PartnersSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <QuickMenu />
        <ContentSection />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
}
