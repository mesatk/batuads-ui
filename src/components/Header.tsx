"use client";

import { useEffect, useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!accessToken && !!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">InvestPro</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Ana Sayfa</a>
            <a href="/yatirimlarim" className="text-gray-700 hover:text-blue-600 transition-colors">Yatırımlarım</a>
            <a href="/hesaplama" className="text-gray-700 hover:text-blue-600 transition-colors">Getiri Hesaplama</a>
            <a href="/profil" className="text-gray-700 hover:text-blue-600 transition-colors">Profilim</a>
          </div>
          <div>
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
      </nav>
    </header>
  );
};

export default Header; 