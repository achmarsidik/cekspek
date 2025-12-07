// src/app/robots.ts
import { MetadataRoute } from 'next'

// ============================================================
// ROBOTS.TXT GENERATOR - SEO OPTIMIZATION
// ============================================================

/**
 * FUNGSI: robots()
 * 
 * Fungsi khusus Next.js yang otomatis generate file robots.txt
 * File ini akan tersedia di: https://cekspek.vercel.app/robots.txt
 * 
 * APA ITU ROBOTS.TXT?
 * - File kecil yang memberitahu search engine (Google, Bing, dll) 
 *   halaman mana yang boleh dan tidak boleh di-crawl
 * - Format plain text yang mudah dibaca
 * - Standar industri untuk kontrol akses crawler
 * 
 * KENAPA PENTING?
 * - Menghemat bandwidth (crawler tidak crawl halaman yang tidak perlu)
 * - Melindungi halaman private (admin panel, API routes)
 * - Mencegah duplicate content di index Google
 * - Mengarahkan crawler ke sitemap untuk indexing lebih efisien
 * 
 * CARA KERJA:
 * 1. Search engine bot (Googlebot, Bingbot, dll) datang ke website
 * 2. Bot langsung cek /robots.txt
 * 3. Bot baca aturan: boleh crawl apa, tidak boleh crawl apa
 * 4. Bot ikuti aturan tersebut saat crawling
 * 
 * FORMAT HASIL (robots.txt):
 * User-agent: *
 * Allow: /
 * Disallow: /admin/
 * Disallow: /api/
 * 
 * Sitemap: https://cekspek.vercel.app/sitemap.xml
 */

export default function robots(): MetadataRoute.Robots {
  return {
    // ============================================================
    // RULES: Aturan untuk semua crawler
    // ============================================================
    /**
     * User-agent: * = Berlaku untuk semua bot
     * 
     * Bisa spesifik per bot:
     * - Googlebot (Google)
     * - Bingbot (Bing)
     * - Slurp (Yahoo)
     * - DuckDuckBot (DuckDuckGo)
     * 
     * Untuk sekarang, kita set rules yang sama untuk semua bot
     */
    rules: [
      {
        userAgent: '*',  // Semua bot
        
        // ============================================================
        // ALLOW: Halaman yang BOLEH di-crawl
        // ============================================================
        /**
         * allow: '/' = Boleh crawl semua halaman secara default
         * 
         * Artinya semua halaman public bisa diindex:
         * - Homepage (/)
         * - Daftar HP (/phones)
         * - Detail HP (/phones/[slug])
         * - Compare (/compare)
         * - Brand (/brands)
         * - dll
         * 
         * Ini setting paling umum untuk website public
         */
        allow: '/',
        
        // ============================================================
        // DISALLOW: Halaman yang TIDAK BOLEH di-crawl
        // ============================================================
        /**
         * Array halaman yang harus di-block dari crawling
         * 
         * KENAPA BLOCK HALAMAN TERTENTU?
         * 
         * 1. /admin/ - Admin Panel
         *    - Halaman private untuk manage website
         *    - Tidak ada gunanya diindex Google
         *    - Bisa expose informasi sensitif
         *    - User publik tidak boleh akses
         * 
         * 2. /api/ - API Routes
         *    - Endpoint backend untuk CRUD database
         *    - Bukan halaman yang bisa ditampilkan di browser
         *    - Crawl endpoint API = waste bandwidth
         *    - Bisa trigger operasi database yang tidak perlu
         * 
         * FORMAT:
         * - /admin/ = Block semua URL yang dimulai dengan /admin/
         *   Contoh: /admin/login, /admin/phones, /admin/dashboard
         * 
         * - /api/ = Block semua API routes
         *   Contoh: /api/phones, /api/reviews, /api/upload
         * 
         * TIPS TAMBAHAN:
         * - /search?* = Block halaman search dengan query params
         *   (untuk avoid duplicate content)
         * - /_next/ = Block Next.js internal files (sudah auto-blocked)
         * - /private/ = Block folder private jika ada
         */
        disallow: [
          '/admin/',  // Block semua halaman admin
          '/api/',    // Block semua API routes
          // '/search?*',  // Uncomment jika mau block search results
          // '/*?*',  // Uncomment jika mau block semua URL dengan query params
        ],
      },
      
      // ============================================================
      // RULES SPESIFIK PER BOT (Opsional)
      // ============================================================
      /**
       * Contoh: Block bot tertentu dari halaman tertentu
       * 
       * {
       *   userAgent: 'GPTBot',  // ChatGPT crawler
       *   disallow: '/',        // Block semua halaman
       * },
       * 
       * {
       *   userAgent: 'AdsBot-Google',  // Google Ads bot
       *   allow: '/phones/',           // Boleh crawl halaman HP saja
       *   disallow: '/',               // Block yang lain
       * },
       * 
       * Untuk sekarang tidak perlu, rules umum sudah cukup
       */
    ],
    
    // ============================================================
    // SITEMAP: URL sitemap.xml
    // ============================================================
    /**
     * FUNGSI:
     * - Memberitahu crawler di mana lokasi sitemap
     * - Crawler akan prioritaskan crawl URL dari sitemap
     * - Mempercepat proses indexing
     * 
     * PENTING:
     * - Harus URL lengkap (bukan path relatif)
     * - Harus accessible (return 200 OK)
     * - Format harus valid XML
     * 
     * HASIL DI ROBOTS.TXT:
     * Sitemap: https://cekspek.vercel.app/sitemap.xml
     * 
     * Google akan:
     * 1. Baca baris ini
     * 2. Fetch sitemap.xml
     * 3. Dapat list semua URL
     * 4. Crawl URL tersebut secara sistematis
     */
    sitemap: 'https://cekspek.vercel.app/sitemap.xml',
  }
}

// ============================================================
// HASIL ROBOTS.TXT (Yang Akan Di-Generate)
// ============================================================
/**
 * File robots.txt akan terlihat seperti ini:
 * 
 * ┌─────────────────────────────────────────────────────────┐
 * │ User-agent: *                                           │
 * │ Allow: /                                                │
 * │ Disallow: /admin/                                       │
 * │ Disallow: /api/                                         │
 * │                                                         │
 * │ Sitemap: https://cekspek.vercel.app/sitemap.xml        │
 * └─────────────────────────────────────────────────────────┘
 * 
 * CARA BACA:
 * - Baris 1: Rules untuk semua bot (*)
 * - Baris 2: Boleh crawl semua path (/)
 * - Baris 3-4: Kecuali /admin/ dan /api/
 * - Baris 6: Lokasi sitemap
 */

// ============================================================
// TESTING ROBOTS.TXT
// ============================================================
/**
 * 1. CEK DI BROWSER:
 *    https://cekspek.vercel.app/robots.txt
 *    Should show plain text dengan rules di atas
 * 
 * 2. TEST DI GOOGLE SEARCH CONSOLE:
 *    - Pergi ke: Tools → robots.txt Tester
 *    - Masukkan URL: https://cekspek.vercel.app/robots.txt
 *    - Google akan validasi format
 *    - Cek apakah ada error
 * 
 * 3. TEST DENGAN TOOL ONLINE:
 *    - https://en.ryte.com/free-tools/robots-txt/
 *    - Masukkan URL robots.txt
 *    - Tool akan parse dan validasi
 * 
 * 4. TEST BLOCKING:
 *    - Test URL: https://cekspek.vercel.app/admin/dashboard
 *    - Harusnya blocked
 *    - Test URL: https://cekspek.vercel.app/phones/samsung-s24
 *    - Harusnya allowed
 */

// ============================================================
// COMMON MISTAKES & BEST PRACTICES
// ============================================================
/**
 * ❌ JANGAN LAKUKAN:
 * 
 * 1. Block root jika tidak perlu:
 *    Disallow: /  ← Ini akan block SEMUA halaman!
 * 
 * 2. Block halaman penting:
 *    Disallow: /phones/  ← Ini konten utama, jangan di-block!
 * 
 * 3. Lupa sitemap:
 *    Tanpa sitemap = crawler sulit temukan halaman baru
 * 
 * 4. Typo di path:
 *    Disallow: /admn/  ← Typo! Seharusnya /admin/
 * 
 * 5. Gunakan robots.txt sebagai security:
 *    robots.txt BUKAN security feature!
 *    Bot jahat bisa ignore aturan
 *    Gunakan authentication untuk halaman private
 * 
 * ✅ BEST PRACTICES:
 * 
 * 1. Keep it simple:
 *    Hanya block yang memang perlu di-block
 * 
 * 2. Test setelah deploy:
 *    Pastikan /robots.txt accessible
 * 
 * 3. Update jika struktur berubah:
 *    Tambah folder baru? Update disallow
 * 
 * 4. Monitor crawl stats:
 *    Di Google Search Console cek crawl errors
 * 
 * 5. Kombinasikan dengan noindex:
 *    robots.txt = prevent crawling
 *    meta noindex = prevent indexing
 *    Gunakan keduanya untuk kontrol maksimal
 */

// ============================================================
// ADVANCED: RULES SPESIFIK
// ============================================================
/**
 * CONTOH KASUS KHUSUS:
 * 
 * 1. Block Pagination dari Indexing:
 *    {
 *      userAgent: '*',
 *      disallow: [
 *        '/phones?page=*',  // Block /phones?page=2, ?page=3, dst
 *      ]
 *    }
 * 
 * 2. Block AI Crawlers:
 *    {
 *      userAgent: 'GPTBot',  // ChatGPT
 *      disallow: '/',
 *    },
 *    {
 *      userAgent: 'CCBot',  // Common Crawl
 *      disallow: '/',
 *    }
 * 
 * 3. Allow Spesifik untuk Ads:
 *    {
 *      userAgent: 'AdsBot-Google',
 *      allow: '/phones/',
 *      disallow: '/',
 *    }
 * 
 * 4. Crawl Delay (untuk server lambat):
 *    rules: [{
 *      userAgent: '*',
 *      crawlDelay: 10,  // Tunggu 10 detik antar request
 *      allow: '/',
 *    }]
 * 
 * Untuk CekSpek.id sekarang, simple rules sudah cukup!
 */

// ============================================================
// MONITORING & MAINTENANCE
// ============================================================
/**
 * SETELAH DEPLOY:
 * 
 * 1. Verify di Google Search Console:
 *    - Pergi ke: Crawl → Crawl Stats
 *    - Cek apakah Googlebot respect rules
 *    - Lihat halaman mana yang paling sering di-crawl
 * 
 * 2. Check Crawl Errors:
 *    - Pergi ke: Coverage → Excluded
 *    - Pastikan hanya /admin/ dan /api/ yang excluded
 *    - Jika ada halaman penting yang blocked = fix robots.txt
 * 
 * 3. Monitor Logs (Opsional):
 *    - Di Vercel Analytics, cek bot traffic
 *    - Pastikan tidak ada bot yang overload server
 *    - Jika ada bot jahat = tambah rules untuk block
 * 
 * 4. Update Regularly:
 *    - Tambah folder baru? Update disallow
 *    - Ganti domain? Update sitemap URL
 *    - Review setiap 3-6 bulan
 */

// ============================================================
// KOMBINASI DENGAN META TAGS
// ============================================================
/**
 * robots.txt = Kontrol CRAWLING (bot mengakses halaman)
 * meta robots = Kontrol INDEXING (halaman muncul di hasil pencarian)
 * 
 * KOMBINASI EFEKTIF:
 * 
 * 1. Halaman Admin:
 *    - robots.txt: Disallow: /admin/
 *    - meta robots: <meta name="robots" content="noindex, nofollow" />
 *    - Hasil: Bot tidak crawl DAN tidak index
 * 
 * 2. Halaman Temporary:
 *    - robots.txt: (allow, tidak di-block)
 *    - meta robots: <meta name="robots" content="noindex" />
 *    - Hasil: Bot bisa crawl, tapi tidak diindex
 * 
 * 3. Halaman Publik:
 *    - robots.txt: Allow: /
 *    - meta robots: <meta name="robots" content="index, follow" />
 *    - Hasil: Bot crawl DAN index (default untuk konten publik)
 * 
 * Di Next.js, meta robots sudah di-set via metadata.robots
 */