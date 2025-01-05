import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvestPro - Akıllı Yatırım Platformu",
  description: "Yatırımlarınızı akıllıca yönetin ve kazançlarınızı takip edin",
};

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">InvestPro</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Ana Sayfa</a>
            <a href="/yatirimlar" className="text-gray-700 hover:text-blue-600 transition-colors">Yatırımlarım</a>
            <a href="/hesaplama" className="text-gray-700 hover:text-blue-600 transition-colors">Getiri Hesaplama</a>
            <a href="/profil" className="text-gray-700 hover:text-blue-600 transition-colors">Profilim</a>
          </div>
          <div>
            <a href="/giris" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Giriş Yap
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
