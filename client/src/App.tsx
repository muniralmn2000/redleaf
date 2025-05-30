import React from "react";
import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

// Import components
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/modals/LoginModal";
import RegistrationModal from "./components/modals/RegistrationModal";
import AdminModal from "./components/modals/AdminModal";
import CoursesSection from "./components/CoursesSection";

// Import pages
import Home from "./pages/home";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import NotFound from "./pages/not-found";
import AdminDashboard from "./pages/admin-dashboard";
import MyMessagesPage from "./pages/my-messages";

function AdminBar() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const checkAdmin = () => setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    checkAdmin();
    window.addEventListener('adminLogin', checkAdmin);
    window.addEventListener('adminLogout', checkAdmin);
    return () => {
      window.removeEventListener('adminLogin', checkAdmin);
      window.removeEventListener('adminLogout', checkAdmin);
    };
  }, []);
  if (!isAdmin) return null;
  return (
    <div className="w-full bg-blue-700 text-white py-2 px-4 flex items-center justify-between z-50 shadow-lg">
      <span className="font-semibold">Admin Mode: You are editing live content</span>
      <button
        className="bg-white text-blue-700 font-bold px-4 py-1 rounded hover:bg-blue-100 transition"
        onClick={() => {
          localStorage.removeItem('isAdmin');
          window.dispatchEvent(new CustomEvent('adminLogout'));
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}

function Router() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleOpenLogin = () => setIsLoginOpen(true);
  const handleCloseLogin = () => setIsLoginOpen(false);
  const handleOpenRegistration = () => setIsRegistrationOpen(true);
  const handleCloseRegistration = () => setIsRegistrationOpen(false);
  const handleOpenAdmin = () => setIsAdminOpen(true);
  const handleCloseAdmin = () => setIsAdminOpen(false);

  const handleSwitchToRegistration = () => {
    setIsLoginOpen(false);
    setIsRegistrationOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminBar />
      <Navbar 
        onOpenLogin={handleOpenLogin}
        onOpenRegistration={handleOpenRegistration}
        onOpenAdmin={handleOpenAdmin}
      />
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/courses">
            <CoursesSection />
          </Route>
          <Route path="/about">
            <AboutPage 
              onOpenLogin={handleOpenLogin}
              onOpenRegistration={handleOpenRegistration}
              onOpenAdmin={handleOpenAdmin}
            />
          </Route>
          <Route path="/contact">
            <ContactPage 
              onOpenLogin={handleOpenLogin}
              onOpenRegistration={handleOpenRegistration}
              onOpenAdmin={handleOpenAdmin}
            />
          </Route>
          <Route path="/admin-dashboard">
            <AdminDashboard />
          </Route>
          <Route path="/my-messages">
            <MyMessagesPage />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        onSwitchToRegistration={handleSwitchToRegistration}
      />
      
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={handleCloseRegistration}
      />
      
      <AdminModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;