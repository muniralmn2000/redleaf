import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CoursesSection from "@/components/CoursesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/modals/RegistrationModal";
import LoginModal from "@/components/modals/LoginModal";
import AdminModal from "@/components/modals/AdminModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const openRegistrationModal = () => setIsRegistrationModalOpen(true);
  const closeRegistrationModal = () => setIsRegistrationModalOpen(false);
  
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  
  const openAdminModal = () => setIsAdminModalOpen(true);
  const closeAdminModal = () => setIsAdminModalOpen(false);

  const switchToRegistration = () => {
    setIsLoginModalOpen(false);
    setIsRegistrationModalOpen(true);
  };

  return (
    <div className="font-poppins bg-white">
      <Navbar 
        onOpenLogin={openLoginModal}
        onOpenRegistration={openRegistrationModal}
        onOpenAdmin={openAdminModal}
      />
      
      <HeroSection onOpenRegistration={openRegistrationModal} />
      <FeaturesSection />
      <CoursesSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
      <Footer />

      <RegistrationModal 
        isOpen={isRegistrationModalOpen}
        onClose={closeRegistrationModal}
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToRegistration={switchToRegistration}
      />
      
      <AdminModal 
        isOpen={isAdminModalOpen}
        onClose={closeAdminModal}
      />
    </div>
  );
}
