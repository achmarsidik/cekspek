// src/components/SEO.tsx
// Component untuk mengelola SEO metadata di setiap halaman

import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noindex?: boolean;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = 'spesifikasi hp, compare smartphone, review hp, harga hp Indonesia',
  ogImage = 'https://cekspek.vercel.app/og-image.jpg',
  ogType = 'website',
  canonical,
  noindex = false,
}: SEOProps): Metadata {
  const siteName = 'CekSpek.id';
  const fullTitle = `${title} | ${siteName}`;
  const siteUrl = 'https://cekspek.vercel.app';

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: 'CekSpek Team' }],
    creator: 'CekSpek.id',
    publisher: 'CekSpek.id',
    
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
      },
    },

    // Open Graph
    openGraph: {
      type: ogType,
      locale: 'id_ID',
      url: canonical || siteUrl,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@cekspekid',
    },

    // Canonical URL
    alternates: {
      canonical: canonical || siteUrl,
    },

    // Verification (opsional - tambahkan setelah daftar Google Search Console)
    verification: {
      google: 'your-google-verification-code',
      // yandex: 'yandex-verification-code',
      // bing: 'bing-verification-code',
    },
  };
}

// Contoh penggunaan di halaman:
// export const metadata = generateSEOMetadata({
//   title: 'Bandingkan Spesifikasi HP',
//   description: 'Bandingkan spesifikasi smartphone terlengkap di Indonesia',
//   keywords: 'compare hp, bandingkan smartphone, spesifikasi hp',
// });