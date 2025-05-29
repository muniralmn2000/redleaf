import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";

export default function Home() {
  const handleOpenRegistration = () => {
    // This will be handled by the parent App component
    console.log('Open registration requested');
  };

  return (
    <div>
      <HeroSection onOpenRegistration={handleOpenRegistration} />
      <TestimonialsSection />
      <CTASection onOpenRegistration={handleOpenRegistration} />
    </div>
  );
}