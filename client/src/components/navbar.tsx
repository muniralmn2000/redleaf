import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenRegistration: () => void;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenRegistration, onOpenLogin, onOpenAdmin }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/98 backdrop-blur-sm shadow-lg z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--edusphere-primary))] to-[hsl(var(--edusphere-secondary))] rounded-full flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-semibold text-[hsl(var(--edusphere-dark))]">EduSphere</span>
              <span className="text-sm font-bold text-[hsl(var(--edusphere-secondary))] ml-2">EDUCATION</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium nav-link"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium nav-link"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('courses')}
              className="text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium nav-link"
            >
              Courses
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium nav-link"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium nav-link"
            >
              Contact
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={onOpenLogin}
              className="text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium"
            >
              Login
            </button>
            <button 
              onClick={onOpenRegistration}
              className="btn-primary"
            >
              Register
            </button>
            <button 
              onClick={onOpenAdmin}
              className="text-gray-600 hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300"
            >
              <i className="fas fa-cog"></i>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-[hsl(var(--edusphere-dark))] focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden bg-white border-t border-gray-100 px-6 py-4 transition-all duration-300",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="space-y-4">
          <button 
            onClick={() => scrollToSection('home')}
            className="block text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('features')}
            className="block text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('courses')}
            className="block text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium"
          >
            Courses
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="block text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="block text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium"
          >
            Contact
          </button>
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <button 
              onClick={() => {
                onOpenLogin();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-[hsl(var(--edusphere-dark))] hover:text-[hsl(var(--edusphere-primary))] transition-colors duration-300 font-medium"
            >
              Login
            </button>
            <button 
              onClick={() => {
                onOpenRegistration();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full btn-primary text-center"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
