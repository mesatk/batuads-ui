"use client";

import { useEffect, useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const checkLoginStatus = () => {
    const accessToken = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!accessToken && !!user);
    
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.role);
    } else {
      setUserRole(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkLoginStatus();

    // localStorage değişikliklerini dinle
    window.addEventListener('storage', checkLoginStatus);
    
    // Custom event dinleyicisi ekle
    window.addEventListener('loginStateChange', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChange', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">InvestPro</span>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm relative">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">InvestPro</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Ana Sayfa</a>
            {isLoggedIn && userRole === "admin" && (
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</a>
            )}
            {isLoggedIn && userRole === "user" && (
              <a href="/yatirimlarim" className="text-gray-700 hover:text-blue-600 transition-colors">Yatırımlarım</a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div className="hidden md:block">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
            ) : (
              <>
                <a href="/giris" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4">
                  Giriş Yap
                </a>
                <a href="/kayit" className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  Kayıt Ol
                </a>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="/" className="block text-gray-700 hover:text-blue-600 transition-colors">Ana Sayfa</a>
              {isLoggedIn && userRole === "admin" && (
                <a href="/dashboard" className="block text-gray-700 hover:text-blue-600 transition-colors">Dashboard</a>
              )}
              {isLoggedIn && userRole === "user" && (
                <a href="/yatirimlarim" className="block text-gray-700 hover:text-blue-600 transition-colors">Yatırımlarım</a>
              )}
              <div className="pt-4 border-t border-gray-200">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                ) : (
                  <div className="space-y-2">
                    <a href="/giris" className="block w-full text-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Giriş Yap
                    </a>
                    <a href="/kayit" className="block w-full text-center bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                      Kayıt Ol
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 