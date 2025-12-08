// src/app/layout.tsx
// Root layout dengan metadata SEO yang lengkap

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cekspek.vercel.app'),
  
  title: {
    default: 'CekSpek.id - Database Spesifikasi Smartphone Indonesia',
    template: '%s | CekSpek.id',
  },
  
  description: 'Database spesifikasi smartphone terlengkap di Indonesia. Bandingkan HP, baca review, dan temukan smartphone impianmu dengan mudah.',
  
  keywords: [
    'spesifikasi hp',
    'compare smartphone',
    'review hp Indonesia',
    'harga hp',
    'database smartphone',
    'bandingkan hp',
    'cek spek hp',
    'smartphone terbaru',
    'hp gaming',
    'kamera hp terbaik',
  ],

  authors: [{ name: 'CekSpek Team', url: 'https://cekspek.vercel.app' }],
  creator: 'CekSpek.id',
  publisher: 'CekSpek.id',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://cekspek.vercel.app',
    title: 'CekSpek.id - Database Spesifikasi Smartphone Indonesia',
    description: 'Database spesifikasi smartphone terlengkap di Indonesia. Bandingkan HP, baca review, dan temukan smartphone impianmu.',
    siteName: 'CekSpek.id',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CekSpek.id - Database Smartphone Indonesia',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CekSpek.id - Database Spesifikasi Smartphone Indonesia',
    description: 'Database spesifikasi smartphone terlengkap di Indonesia',
    images: ['/og-image.jpg'],
    creator: '@cekspekid',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'your-google-verification-code',
    // Tambahkan setelah daftar Google Search Console
  },

  category: 'technology',
  
  alternates: {
    canonical: 'https://cekspek.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {/* Google Analytics - Opsional */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script> */}
        
        {/* Preconnect untuk performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}