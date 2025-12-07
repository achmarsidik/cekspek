// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================
// METADATA GLOBAL - SEO OPTIMIZATION
// ============================================================
export const metadata: Metadata = {
  // 1. METADATA BASE
  // Fungsi: Menentukan base URL untuk semua metadata (Open Graph, Canonical, dll)
  // Ganti 'https://cekspek.vercel.app' dengan domain custom Anda nanti
  metadataBase: new URL('https://cekspek.vercel.app'),
  
  // 2. TITLE
  // Fungsi: Judul website yang muncul di tab browser & hasil pencarian Google
  // - default: Judul untuk halaman yang tidak punya metadata title sendiri
  // - template: Format judul untuk halaman child (contoh: "Galaxy S24 | CekSpek.id")
  //   %s akan diganti dengan judul halaman spesifik
  title: {
    default: 'CekSpek.id - Perbandingan Spesifikasi HP Terlengkap Indonesia',
    template: '%s | CekSpek.id' // Halaman detail HP: "Samsung Galaxy S24 | CekSpek.id"
  },
  
  // 3. DESCRIPTION
  // Fungsi: Deskripsi website yang muncul di hasil pencarian Google (snippet)
  // Tips: 150-160 karakter, harus menarik agar user klik
  description: 'Bandingkan spesifikasi HP terlengkap dari berbagai brand. Temukan smartphone impianmu dengan fitur compare, review, dan harga terbaik dari Shopee & Tokopedia. Database smartphone Indonesia paling lengkap!',
  
  // 4. KEYWORDS
  // Fungsi: Kata kunci untuk SEO (masih relevan untuk beberapa search engine)
  // Tips: Gunakan kata kunci yang sering dicari user
  keywords: [
    'spesifikasi hp',
    'perbandingan hp',
    'compare smartphone',
    'review hp',
    'harga hp',
    'cek spek hp',
    'database hp indonesia',
    'smartphone terbaik',
    'hp samsung',
    'hp xiaomi',
    'hp oppo',
    'hp vivo'
  ],
  
  // 5. AUTHORS & CREATOR
  // Fungsi: Menandai siapa pembuat website (untuk kredibilitas)
  authors: [{ name: 'CekSpek.id Team' }],
  creator: 'CekSpek.id',
  publisher: 'CekSpek.id',
  
  // 6. ROBOTS
  // Fungsi: Memberitahu Google & search engine lain apa yang boleh di-crawl
  robots: {
    index: true,      // Boleh diindex Google
    follow: true,     // Boleh follow link di website
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,        // Tampilkan preview video tanpa batas
      'max-image-preview': 'large',   // Tampilkan gambar besar di hasil pencarian
      'max-snippet': -1,              // Tampilkan snippet teks tanpa batas
    },
  },
  
  // 7. OPEN GRAPH (untuk social media: Facebook, WhatsApp, LinkedIn)
  // Fungsi: Ketika link website di-share, akan muncul preview card yang menarik
  openGraph: {
    type: 'website',
    locale: 'id_ID',          // Bahasa Indonesia
    url: 'https://cekspek.vercel.app',
    siteName: 'CekSpek.id',
    title: 'CekSpek.id - Perbandingan Spesifikasi HP Terlengkap',
    description: 'Bandingkan spesifikasi HP terlengkap dari berbagai brand. Temukan smartphone impianmu dengan fitur compare, review, dan harga terbaik.',
    images: [
      {
        url: '/og-image.png',  // Gambar preview (buat nanti ukuran 1200x630px)
        width: 1200,
        height: 630,
        alt: 'CekSpek.id - Database Spesifikasi HP Indonesia',
      },
    ],
  },
  
  // 8. TWITTER CARD (untuk preview di Twitter/X)
  // Fungsi: Preview card khusus untuk Twitter dengan format yang optimal
  twitter: {
    card: 'summary_large_image',  // Format card: gambar besar
    title: 'CekSpek.id - Perbandingan Spesifikasi HP Terlengkap',
    description: 'Bandingkan spesifikasi HP terlengkap dari berbagai brand. Database smartphone Indonesia paling lengkap!',
    images: ['/og-image.png'],
    creator: '@cekspekid',  // Ganti dengan Twitter handle Anda (jika ada)
  },
  
  // 9. VERIFICATION
  // Fungsi: Verifikasi website di Google Search Console & Bing
  // Cara dapat kode:
  // - Google: https://search.google.com/search-console
  // - Bing: https://www.bing.com/webmasters
  // Isi setelah website sudah live dan Anda verifikasi
  verification: {
    google: 'your-google-verification-code-here',  // Ganti setelah verifikasi
    // yandex: 'your-yandex-code',
    // bing: 'your-bing-code',
  },
  
  // 10. ALTERNATE LANGUAGES (jika punya versi bahasa lain)
  // Fungsi: Memberitahu Google ada versi bahasa lain dari website
  // Untuk sekarang kita hanya punya versi Indonesia
  alternates: {
    canonical: 'https://cekspek.vercel.app',  // URL canonical (versi utama)
  },
  
  // 11. MANIFEST (untuk PWA - Progressive Web App)
  // Fungsi: Agar website bisa di-install seperti aplikasi di HP
  // File manifest.json akan kita buat nanti jika mau support PWA
  // manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

// ============================================================
// PENJELASAN DETAIL SETIAP FUNGSI:
// ============================================================

/**
 * 1. metadataBase
 * - Menentukan base URL untuk semua path relatif di metadata
 * - Contoh: jika image: '/og-image.png', akan jadi 'https://cekspek.vercel.app/og-image.png'
 * - WAJIB diisi agar Open Graph bekerja dengan benar
 * 
 * 2. title.default & title.template
 * - default: Judul fallback untuk halaman tanpa metadata sendiri
 * - template: Format judul child pages dengan %s sebagai placeholder
 * - Contoh di halaman detail: "Samsung Galaxy S24 Ultra | CekSpek.id"
 * 
 * 3. description
 * - Muncul di Google sebagai snippet di bawah judul
 * - Panjang ideal: 150-160 karakter
 * - Harus jelas, menarik, dan ada call-to-action (CTA)
 * 
 * 4. keywords
 * - Membantu search engine memahami topik website
 * - Google tidak terlalu memprioritaskan, tapi tetap berguna
 * - Gunakan kata kunci yang relevan dan sering dicari
 * 
 * 5. robots
 * - index: true = boleh muncul di hasil pencarian
 * - follow: true = boleh ikuti link di website
 * - max-image-preview: 'large' = tampilkan gambar besar di Google Images
 * 
 * 6. openGraph
 * - Preview card ketika link di-share di social media
 * - Gambar og-image.png harus ukuran 1200x630px untuk hasil optimal
 * - type: 'website' untuk homepage, 'article' untuk halaman konten
 * 
 * 7. twitter
 * - Preview khusus untuk Twitter/X
 * - summary_large_image: card besar dengan gambar dominan
 * - Bisa beda dengan Open Graph untuk optimasi platform
 * 
 * 8. verification
 * - Kode verifikasi dari Google Search Console
 * - Diperlukan untuk submit sitemap dan lihat analytics
 * - Isi setelah website live dan verifikasi di GSC
 * 
 * 9. alternates.canonical
 * - URL utama/resmi dari halaman (mencegah duplicate content)
 * - Penting untuk SEO agar Google tahu versi mana yang utama
 * 
 * 10. lang="id" di <html>
 * - Memberitahu browser & Google bahasa website adalah Indonesia
 * - Membantu SEO lokal dan aksesibilitas (screen reader)
 */