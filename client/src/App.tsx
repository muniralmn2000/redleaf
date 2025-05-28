import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/modals/LoginModal";
import RegistrationModal from "@/components/modals/RegistrationModal";
import AdminModal from "@/components/modals/AdminModal";

// Import pages
import Home from "@/pages/home";
import FeaturesPage from "@/pages/features";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import NotFound from "@/pages/not-found";

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
      <Navbar 
        onOpenLogin={handleOpenLogin}
        onOpenRegistration={handleOpenRegistration}
        onOpenAdmin={handleOpenAdmin}
      />
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/features">
            <FeaturesPage 
              onOpenLogin={handleOpenLogin}
              onOpenRegistration={handleOpenRegistration}
              onOpenAdmin={handleOpenAdmin}
            />
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