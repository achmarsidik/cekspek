// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

// ============================================================
// SITEMAP GENERATOR - SEO OPTIMIZATION
// ============================================================

/**
 * FUNGSI: sitemap()
 * 
 * Fungsi khusus Next.js yang otomatis generate file sitemap.xml
 * File ini akan tersedia di: https://cekspek.vercel.app/sitemap.xml
 * 
 * APA ITU SITEMAP?
 * - Daftar lengkap semua halaman di website
 * - Format XML yang dibaca oleh Google & search engine
 * - Membantu Google menemukan & index semua halaman dengan cepat
 * 
 * KENAPA PENTING?
 * - Google bisa langsung tahu ada berapa halaman di website
 * - Mempercepat proses indexing (halaman baru cepat muncul di Google)
 * - Memberitahu Google halaman mana yang prioritas (lewat priority)
 * - Memberitahu seberapa sering halaman berubah (lewat changeFrequency)
 * 
 * CARA KERJA:
 * 1. Ambil semua data HP dari database
 * 2. Ambil semua data brand dari database
 * 3. Generate URL untuk semua halaman (statis & dinamis)
 * 4. Return array dalam format sitemap Next.js
 * 5. Next.js otomatis convert ke XML
 * 
 * FORMAT HASIL (sitemap.xml):
 * <?xml version="1.0" encoding="UTF-8"?>
 * <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
 *   <url>
 *     <loc>https://cekspek.vercel.app/</loc>
 *     <lastmod>2025-01-10</lastmod>
 *     <changefreq>daily</changefreq>
 *     <priority>1.0</priority>
 *   </url>
 *   ...
 * </urlset>
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL website (ganti dengan domain custom nanti)
  const baseUrl = 'https://cekspek.vercel.app'
  
  // ============================================================
  // 1. AMBIL DATA HP DARI DATABASE
  // ============================================================
  /**
   * Query semua HP yang ada di database
   * - Select slug (untuk URL) dan updated_at (untuk lastModified)
   * - Order by updated_at descending (yang terbaru di atas)
   * 
   * Contoh data:
   * [
   *   { slug: 'samsung-galaxy-s24-ultra', updated_at: '2025-01-10' },
   *   { slug: 'iphone-16-pro-max', updated_at: '2025-01-09' },
   *   ...
   * ]
   */
  const { data: phones } = await supabase
    .from('phones')
    .select('slug, updated_at')
    .order('updated_at', { ascending: false })

  // ============================================================
  // 2. AMBIL DATA BRAND DARI DATABASE
  // ============================================================
  /**
   * Query semua brand untuk halaman /brands/[slug]
   * Nanti untuk halaman seperti: /brands/samsung, /brands/xiaomi, dll
   */
  const { data: brands } = await supabase
    .from('brands')
    .select('slug')
    .order('name')

  // ============================================================
  // 3. HALAMAN STATIS (Fixed Pages)
  // ============================================================
  /**
   * Halaman yang tidak berubah (bukan dinamis dari database)
   * - Homepage (/)
   * - Daftar HP (/phones)
   * - Compare (/compare)
   * - Daftar Brand (/brands)
   * 
   * PROPERTI SETIAP HALAMAN:
   * 
   * - url: URL lengkap halaman
   * - lastModified: Kapan terakhir diupdate (untuk cache Google)
   * - changeFrequency: Seberapa sering halaman berubah
   *   Options: 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
   * - priority: Prioritas halaman (0.0 - 1.0)
   *   1.0 = Paling penting (homepage)
   *   0.8 = Sangat penting
   *   0.5 = Normal
   *   0.3 = Kurang penting
   * 
   * TIPS PRIORITAS:
   * - Homepage: 1.0 (paling penting)
   * - Halaman utama: 0.8-0.9
   * - Halaman detail: 0.7-0.8
   * - Halaman lainnya: 0.5-0.6
   */
  const staticPages = [
    {
      url: baseUrl,  // Homepage: https://cekspek.vercel.app
      lastModified: new Date(),  // Update setiap kali sitemap di-generate
      changeFrequency: 'daily' as const,  // Homepage sering berubah (HP baru, promo, dll)
      priority: 1,  // Prioritas tertinggi
    },
    {
      url: `${baseUrl}/phones`,  // Daftar semua HP
      lastModified: new Date(),
      changeFrequency: 'daily' as const,  // Sering ada HP baru
      priority: 0.9,  // Hampir setinggi homepage
    },
    {
      url: `${baseUrl}/compare`,  // Halaman compare
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,  // Jarang berubah
      priority: 0.8,  // Fitur penting
    },
    {
      url: `${baseUrl}/brands`,  // Daftar brand
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,  // Brand jarang bertambah
      priority: 0.7,  // Cukup penting
    },
  ]

  // ============================================================
  // 4. HALAMAN DETAIL HP (Dinamis dari Database)
  // ============================================================
  /**
   * Generate URL untuk setiap HP di database
   * 
   * Contoh hasil:
   * - https://cekspek.vercel.app/phones/samsung-galaxy-s24-ultra
   * - https://cekspek.vercel.app/phones/iphone-16-pro-max
   * - https://cekspek.vercel.app/phones/xiaomi-14-ultra
   * 
   * lastModified menggunakan updated_at dari database
   * Jadi Google tahu kapan terakhir HP ini diupdate
   */
  const phonePages = (phones || []).map((phone) => ({
    url: `${baseUrl}/phones/${phone.slug}`,
    lastModified: new Date(phone.updated_at),  // Dari database
    changeFrequency: 'weekly' as const,  // Spek HP jarang berubah setelah dirilis
    priority: 0.8,  // Halaman detail HP = sangat penting (konten utama)
  }))

  // ============================================================
  // 5. HALAMAN BRAND (Dinamis dari Database)
  // ============================================================
  /**
   * Generate URL untuk setiap brand
   * 
   * Contoh hasil:
   * - https://cekspek.vercel.app/brands/samsung
   * - https://cekspek.vercel.app/brands/xiaomi
   * - https://cekspek.vercel.app/brands/apple
   * 
   * Prioritas lebih rendah karena ini halaman filter/kategori
   */
  const brandPages = (brands || []).map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,  // Daftar HP per brand jarang berubah drastis
    priority: 0.6,  // Kurang penting dari detail HP
  }))

  // ============================================================
  // 6. GABUNGKAN SEMUA & RETURN
  // ============================================================
  /**
   * Gabungkan semua halaman jadi satu array
   * Urutan: Statis → HP → Brand
   * 
   * Next.js akan otomatis convert array ini ke XML format sitemap
   * dan tersedia di /sitemap.xml
   */
  return [...staticPages, ...phonePages, ...brandPages]
}

// ============================================================
// CARA SUBMIT SITEMAP KE GOOGLE
// ============================================================
/**
 * SETELAH DEPLOY:
 * 
 * 1. Cek sitemap sudah tersedia:
 *    Buka: https://cekspek.vercel.app/sitemap.xml
 *    
 * 2. Pergi ke Google Search Console:
 *    https://search.google.com/search-console
 *    
 * 3. Tambahkan property (website):
 *    - Klik "Add Property"
 *    - Pilih "URL prefix"
 *    - Masukkan: https://cekspek.vercel.app
 *    
 * 4. Verifikasi website:
 *    - Pilih metode verifikasi (HTML tag recommended)
 *    - Copy kode verifikasi
 *    - Paste di layout.tsx di bagian verification.google
 *    - Deploy ulang
 *    - Klik "Verify"
 *    
 * 5. Submit sitemap:
 *    - Di sidebar klik "Sitemaps"
 *    - Add new sitemap
 *    - Masukkan: sitemap.xml
 *    - Klik "Submit"
 *    
 * 6. Tunggu Google crawl (1-7 hari):
 *    - Google akan mulai index halaman
 *    - Bisa cek progress di "Coverage" tab
 *    
 * MANFAAT SETELAH SUBMIT:
 * ✅ Halaman baru otomatis ter-index cepat
 * ✅ Bisa lihat statistik: berapa halaman yang diindex
 * ✅ Dapat notif jika ada error crawling
 * ✅ Bisa request indexing manual untuk halaman penting
 */

// ============================================================
// DYNAMIC SITEMAP (Untuk Website Besar)
// ============================================================
/**
 * Jika nanti website punya 1000+ HP, sitemap bisa jadi terlalu besar.
 * Google recommend max 50,000 URL per sitemap.
 * 
 * SOLUSI: Dynamic Sitemap dengan Index
 * 
 * Buat file:
 * - sitemap.xml (index yang list semua sitemap)
 * - sitemap-0.xml (HP 1-500)
 * - sitemap-1.xml (HP 501-1000)
 * - sitemap-2.xml (HP 1001-1500)
 * dst...
 * 
 * Next.js support ini dengan:
 * export default function sitemap() {
 *   return {
 *     id: 0,
 *     url: 'https://cekspek.vercel.app/sitemap-0.xml',
 *   }
 * }
 * 
 * Tapi untuk sekarang (100-500 HP), sitemap tunggal sudah cukup!
 */

// ============================================================
// MONITORING SITEMAP
// ============================================================
/**
 * CARA CEK SITEMAP BEKERJA:
 * 
 * 1. Test di browser:
 *    https://cekspek.vercel.app/sitemap.xml
 *    Should show XML dengan semua URL
 *    
 * 2. Test dengan validator:
 *    - https://www.xml-sitemaps.com/validate-xml-sitemap.html
 *    - Paste URL sitemap Anda
 *    - Cek apakah valid
 *    
 * 3. Monitor di Google Search Console:
 *    - Lihat berapa URL yang submitted
 *    - Lihat berapa yang sudah diindex
 *    - Cek jika ada error
 *    
 * 4. Update otomatis:
 *    - Sitemap di-generate setiap kali ada request
 *    - Jadi selalu up-to-date dengan database
 *    - Tidak perlu manual update!
 */

// ============================================================
// TIPS OPTIMASI SITEMAP
// ============================================================
/**
 * 1. Gunakan lastModified dengan benar
 *    - Ambil dari database (updated_at)
 *    - Jangan hardcode new Date() untuk halaman dinamis
 *    
 * 2. Set priority realistis
 *    - Homepage = 1.0
 *    - Halaman penting = 0.8-0.9
 *    - Halaman biasa = 0.5-0.7
 *    - Jangan semua 1.0!
 *    
 * 3. changeFrequency harus akurat
 *    - daily = untuk halaman yang berubah setiap hari
 *    - weekly = untuk konten yang stabil
 *    - monthly = untuk halaman yang jarang update
 *    
 * 4. Exclude halaman yang tidak penting
 *    - Jangan include halaman admin
 *    - Jangan include halaman error (404, 500)
 *    - Jangan include halaman duplicate
 *    
 * 5. Test sebelum production
 *    - Cek di localhost:3000/sitemap.xml
 *    - Pastikan semua URL valid
 *    - Pastikan tidak ada URL yang broken
 */