import { useState } from "react";

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegistration: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenLogin, onOpenRegistration, onOpenAdmin }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/98 backdrop-blur-sm shadow-lg z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-semibold text-dark">EduSphere</span>
              <span className="text-sm font-bold text-secondary ml-2">EDUCATION</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-dark hover:text-primary transition-colors duration-300 font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-dark hover:text-primary transition-colors duration-300 font-medium relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('courses')}
              className="text-dark hover:text-primary transition-colors duration-300 font-medium relative group"
            >
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-dark hover:text-primary transition-colors duration-300 font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-dark hover:text-primary transition-colors duration-300 font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={onOpenLogin}
              className="text-dark hover:text-primary transition-colors duration-300 font-medium"
            >
              Login
            </button>
            <button 
              onClick={onOpenRegistration}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-medium"
            >
              Register
            </button>
            <button 
              onClick={onOpenAdmin}
              className="text-gray-600 hover:text-primary transition-colors duration-300"
            >
              <i className="fas fa-cog"></i>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-dark focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4">
          <div className="space-y-4">
            <button 
              onClick={() => scrollToSection('home')}
              className="block text-dark hover:text-primary transition-colors duration-300 font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="block text-dark hover:text-primary transition-colors duration-300 font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('courses')}
              className="block text-dark hover:text-primary transition-colors duration-300 font-medium"
            >
              Courses
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="block text-dark hover:text-primary transition-colors duration-300 font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block text-dark hover:text-primary transition-colors duration-300 font-medium"
            >
              Contact
            </button>
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <button 
                onClick={onOpenLogin}
                className="block w-full text-left text-dark hover:text-primary transition-colors duration-300 font-medium"
              >
                Login
              </button>
              <button 
                onClick={onOpenRegistration}
                className="block w-full bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-center font-medium"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
