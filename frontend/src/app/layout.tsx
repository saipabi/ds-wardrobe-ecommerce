import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { CartDrawer } from '../components/CartDrawer';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'DS WARDROBE | Luxury Ready-to-Wear & Festive Couture Boutique',
  description:
    'Discover curated capsule drops from DS Wardrobe. Sculpted liquid satins, chic tailored co-ords, regal velvet kurta sets, and modern festive couture. Pan-India express delivery.',
  keywords: [
    'DS Wardrobe',
    'Clothing Boutique',
    'Co-ord sets',
    'Satin dresses',
    'Festive wear India',
    'Singarayakonda fashion',
    'Modern Indian couture'
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0D0D0E] text-[#F8F7F4] min-h-screen flex flex-col antialiased selection:bg-[#D4AF37] selection:text-black">
        <AuthProvider>
          <CartProvider>
            <React.Suspense fallback={null}>
              <Navbar />
            </React.Suspense>
            <CartDrawer />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <React.Suspense fallback={null}>
              <BottomNav />
            </React.Suspense>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
