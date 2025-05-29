import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Navbar({ onOpenRegistration, onOpenLogin, onOpenAdmin }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const admin = localStorage.getItem('isAdmin') === 'true';
      setIsLoggedIn(loggedIn);
      setIsAdmin(admin);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('login', checkAuth);
    window.addEventListener('logout', checkAuth);
    window.addEventListener('adminLogin', checkAuth);
    window.addEventListener('adminLogout', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('login', checkAuth);
      window.removeEventListener('logout', checkAuth);
      window.removeEventListener('adminLogin', checkAuth);
      window.removeEventListener('adminLogout', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('logout'));
    window.dispatchEvent(new Event('adminLogout'));
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.reload();
  };

  const adminEmail = isAdmin ? localStorage.getItem('adminEmail') : null;
  const userEmail = !isAdmin && isLoggedIn ? localStorage.getItem('userEmail') : null;

  // Modern gradient and glassmorphism style
  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-xl backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20 relative">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <span className="flex items-center gap-2 cursor-pointer select-none">
              <span
                className="inline-block bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden"
                style={{ width: '56px', height: '56px' }}
              >
                <img
                  src="/assets/images/red-leaf-logo.jpg.png"
                  alt="Red Leaf Logo"
                  className="w-full h-full object-cover"
                  style={{ display: 'block' }}
                />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">Red Leaf <span className="text-pink-200">EDUCATION</span></span>
            </span>
          </Link>
        </div>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8 text-lg font-semibold items-center">
          <Link href="/"><span className="nav-link">Home</span></Link>
          <Link href="/courses"><span className="nav-link">Courses</span></Link>
          <Link href="/about"><span className="nav-link">About</span></Link>
          <Link href="/contact"><span className="nav-link">Contact</span></Link>
          {!isAdmin && isLoggedIn && (
            <Link href="/my-messages"><span className="nav-link text-pink-200">My Messages</span></Link>
          )}
          {isAdmin && (
            <Link href="/admin-dashboard"><span className="nav-link text-pink-200">Dashboard</span></Link>
          )}
        </div>
        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && isAdmin && (
            <span className="text-white font-semibold px-3 py-1 rounded bg-blue-700/60">{adminEmail}</span>
          )}
          {!isLoggedIn && (
            <>
              <button
                onClick={onOpenLogin}
                className="px-5 py-2 rounded-lg bg-white text-blue-700 font-bold shadow hover:bg-blue-100 transition-all duration-200"
              >Login</button>
              <button
                onClick={onOpenRegistration}
                className="px-5 py-2 rounded-lg bg-pink-500 text-white font-bold shadow hover:bg-pink-400 transition-all duration-200"
              >Register</button>
            </>
          )}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow hover:from-red-600 hover:to-pink-600 transition-all duration-200"
            >Log out</button>
          )}
        </div>
        {/* Mobile Hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2 rounded hover:bg-white/10 transition" onClick={() => setMobileOpen(v => !v)} aria-label="Open menu">
          <span className="block w-7 h-1 bg-white rounded"></span>
          <span className="block w-7 h-1 bg-white rounded"></span>
          <span className="block w-7 h-1 bg-white rounded"></span>
        </button>
        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="absolute top-20 left-0 w-full bg-gradient-to-br from-blue-700 via-purple-700 to-pink-500 shadow-2xl py-8 flex flex-col items-center gap-6 md:hidden animate-fade-in z-50">
            <Link href="/" onClick={() => setMobileOpen(false)}><span className="nav-link text-white text-xl">Home</span></Link>
            <Link href="/courses" onClick={() => setMobileOpen(false)}><span className="nav-link text-white text-xl">Courses</span></Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}><span className="nav-link text-white text-xl">About</span></Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}><span className="nav-link text-white text-xl">Contact</span></Link>
            {!isAdmin && isLoggedIn && (
              <Link href="/my-messages" onClick={() => setMobileOpen(false)}><span className="nav-link text-pink-200 text-xl">My Messages</span></Link>
            )}
            {isAdmin && (
              <Link href="/admin-dashboard" onClick={() => setMobileOpen(false)}><span className="nav-link text-pink-200 text-xl">Dashboard</span></Link>
            )}
            <div className="flex flex-col gap-3 mt-4">
              {!isLoggedIn && (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); onOpenLogin(); }}
                    className="px-5 py-2 rounded-lg bg-white text-blue-700 font-bold shadow hover:bg-blue-100 transition-all duration-200"
                  >Login</button>
                  <button
                    onClick={() => { setMobileOpen(false); onOpenRegistration(); }}
                    className="px-5 py-2 rounded-lg bg-pink-500 text-white font-bold shadow hover:bg-pink-400 transition-all duration-200"
                  >Register</button>
                </>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow hover:from-red-600 hover:to-pink-600 transition-all duration-200"
                >Log out</button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Custom styles for nav-link hover */}
      <style jsx>{`
        .nav-link {
          color: #fff;
          position: relative;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-link:after {
          content: '';
          display: block;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #fff, #f472b6);
          transition: width 0.3s;
          position: absolute;
          left: 0;
          bottom: -4px;
        }
        .nav-link:hover {
          color: #f472b6;
        }
        .nav-link:hover:after {
          width: 100%;
        }
        @media (max-width: 768px) {
          .nav-link {
            color: #fff;
            font-size: 1.25rem;
          }
        }
      `}</style>
    </nav>
  );
}
