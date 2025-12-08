// src/app/sitemap.ts
// Sitemap otomatis untuk SEO - Google akan crawl URL ini

import { MetadataRoute } from 'next';

// TODO: Ganti dengan fetch dari Supabase setelah database ready
async function getAllPhones() {
  // Contoh data dummy - nanti ganti dengan query Supabase
  return [
    { slug: 'samsung-galaxy-s24', updatedAt: '2024-12-08' },
    { slug: 'iphone-15-pro-max', updatedAt: '2024-12-07' },
    { slug: 'xiaomi-14-ultra', updatedAt: '2024-12-06' },
    // ... data HP lainnya dari database
  ];
}

async function getAllBrands() {
  return [
    { slug: 'samsung', updatedAt: '2024-12-08' },
    { slug: 'apple', updatedAt: '2024-12-08' },
    { slug: 'xiaomi', updatedAt: '2024-12-08' },
    { slug: 'oppo', updatedAt: '2024-12-08' },
    { slug: 'vivo', updatedAt: '2024-12-08' },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cekspek.vercel.app';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/phones`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Dynamic pages - phones
  const phones = await getAllPhones();
  const phonePages = phones.map((phone) => ({
    url: `${baseUrl}/phones/${phone.slug}`,
    lastModified: new Date(phone.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic pages - brands
  const brands = await getAllBrands();
  const brandPages = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: new Date(brand.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...phonePages, ...brandPages];
}

// Cara kerja:
// 1. File ini akan otomatis generate sitemap.xml di /sitemap.xml
// 2. Google akan crawl: https://cekspek.vercel.app/sitemap.xml
// 3. Setelah database ready, ganti getAllPhones() dengan query Supabase