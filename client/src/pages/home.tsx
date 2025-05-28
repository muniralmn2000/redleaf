import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CoursesSection from "@/components/CoursesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  const handleOpenRegistration = () => {
    // This will be handled by the parent App component
    console.log('Open registration requested');
  };

  return (
    <div>
      <HeroSection onOpenRegistration={handleOpenRegistration} />
      <FeaturesSection />
      <CoursesSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}