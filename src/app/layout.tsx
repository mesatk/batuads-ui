import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '../components/Header';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvestPro - Akıllı Yatırım Platformu",
  description: "Yatırımlarınızı akıllıca yönetin ve kazançlarınızı takip edin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  );
}
