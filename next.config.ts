// next.config.ts
import type { NextConfig } from "next";

// ============================================================
// NEXT.JS CONFIGURATION - PERFORMANCE & SEO OPTIMIZATION
// ============================================================

/**
 * FILE INI: Configuration untuk optimize performa dan SEO website
 * 
 * FUNGSI UTAMA:
 * 1. Image Optimization - Gambar HP loading cepat
 * 2. Compression - File HTML/CSS/JS lebih kecil
 * 3. Security Headers - Protect dari attack
 * 4. Redirect & Rewrites - URL management
 * 5. Caching - Website lebih cepat
 * 
 * IMPACT SEO:
 * - Loading cepat = Ranking Google lebih tinggi
 * - Core Web Vitals bagus = User experience baik
 * - Security = Trust signals untuk Google
 */

const nextConfig: NextConfig = {
  // ============================================================
  // 1. IMAGE OPTIMIZATION
  // ============================================================
  /**
   * FUNGSI: Optimize gambar otomatis untuk performa maksimal
   * 
   * CARA KERJA NEXT.JS IMAGE:
   * - Gambar di-resize otomatis sesuai device (mobile = kecil, desktop = besar)
   * - Convert ke format modern (WebP, AVIF) yang lebih kecil
   * - Lazy loading (gambar load saat user scroll)
   * - Blur placeholder saat loading
   * 
   * KENAPA PENTING UNTUK SEO:
   * - Page load speed = ranking factor Google
   * - Core Web Vitals (LCP, CLS) = penting untuk SEO
   * - Mobile performance = Mobile-First Indexing
   * 
   * CONTOH IMPACT:
   * - Gambar original: 2MB (JPEG)
   * - Setelah optimize: 100KB (WebP)
   * - Loading time: 3 detik → 0.3 detik
   * - Bandwidth saved: 95%
   */
  images: {
    // ============================================================
    // A. ALLOWED DOMAINS (Cloudinary)
    // ============================================================
    /**
     * domains: List domain external yang diizinkan untuk images
     * 
     * KENAPA PERLU:
     * - Next.js Image hanya optimize gambar dari domain yang di-whitelist
     * - Untuk security (prevent hotlinking dari domain random)
     * 
     * CLOUDINARY:
     * - res.cloudinary.com = domain untuk semua gambar Cloudinary
     * - Semua foto HP kita disimpan di sini
     * 
     * CONTOH URL:
     * https://res.cloudinary.com/dck1lz7pt/image/upload/v1234567890/phones/samsung-s24.jpg
     * 
     * CARA TAMBAH DOMAIN LAIN:
     * domains: [
     *   'res.cloudinary.com',
     *   'images.unsplash.com',  // Jika pakai Unsplash
     *   'via.placeholder.com',  // Placeholder images
     * ]
     */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Semua path di domain ini
      },
    ],
    
    // ============================================================
    // B. IMAGE FORMATS (WebP & AVIF)
    // ============================================================
    /**
     * formats: Format gambar modern yang di-support
     * 
     * AVIF:
     * - Format paling baru dan paling efisien
     * - 50% lebih kecil dari WebP
     * - 70% lebih kecil dari JPEG
     * - Support browser modern (Chrome 85+, Firefox 93+)
     * 
     * WebP:
     * - Format modern yang sudah mature
     * - 30% lebih kecil dari JPEG
     * - Support hampir semua browser
     * 
     * CARA KERJA:
     * 1. Browser request gambar
     * 2. Next.js cek: browser support AVIF?
     * 3. Jika ya → serve AVIF
     * 4. Jika tidak → cek support WebP?
     * 5. Jika ya → serve WebP
     * 6. Jika tidak → serve JPEG original
     * 
     * CONTOH:
     * - Safari iOS: Get WebP (tidak support AVIF)
     * - Chrome desktop: Get AVIF (support semua)
     * - Internet Explorer: Get JPEG (tidak support modern format)
     */
    formats: ['image/avif', 'image/webp'],
    
    // ============================================================
    // C. DEVICE SIZES (Responsive)
    // ============================================================
    /**
     * deviceSizes: Breakpoint untuk device berbeda
     * 
     * FUNGSI:
     * - Next.js generate multiple size untuk setiap gambar
     * - Mobile dapat gambar kecil
     * - Desktop dapat gambar besar
     * - Hemat bandwidth = loading cepat
     * 
     * DEFAULT BREAKPOINTS:
     * - 640px = Mobile portrait
     * - 750px = Mobile landscape / Small tablet
     * - 828px = Tablet portrait
     * - 1080px = Tablet landscape / Small laptop
     * - 1200px = Desktop
     * - 1920px = Large desktop
     * - 2048px = 2K monitor
     * - 3840px = 4K monitor
     * 
     * CONTOH:
     * User dengan iPhone (width 375px) akan dapat gambar 640px
     * User dengan MacBook (width 1440px) akan dapat gambar 1920px
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // ============================================================
    // D. IMAGE SIZES (Custom Breakpoints)
    // ============================================================
    /**
     * imageSizes: Size untuk layout-responsive images
     * 
     * Digunakan untuk <Image> dengan layout="responsive"
     * Contoh: Card HP di grid yang berubah size
     */
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // ============================================================
    // E. MINIMUMCACHETTL (Caching Duration)
    // ============================================================
    /**
     * minimumCacheTTL: Berapa lama gambar di-cache (dalam detik)
     * 
     * 60 detik = 1 menit
     * 3600 detik = 1 jam
     * 86400 detik = 1 hari
     * 31536000 detik = 1 tahun
     * 
     * UNTUK CEKSPEK.ID:
     * - Gambar HP jarang berubah
     * - Cache 1 tahun = optimal
     * - User tidak perlu re-download gambar yang sama
     * 
     * IMPACT:
     * - First visit: Download gambar
     * - Subsequent visits: Load dari cache (instant!)
     * - Bandwidth saved: 100% (tidak download lagi)
     */
    minimumCacheTTL: 31536000, // 1 tahun
  },

  // ============================================================
  // 2. COMPRESSION (Gzip/Brotli)
  // ============================================================
  /**
   * compress: Enable Gzip compression untuk semua response
   * 
   * CARA KERJA:
   * - HTML/CSS/JS di-compress sebelum dikirim ke browser
   * - Browser decompress otomatis
   * - Transfer size lebih kecil = loading cepat
   * 
   * CONTOH:
   * - HTML original: 200 KB
   * - Setelah Gzip: 40 KB (80% lebih kecil)
   * 
   * CATATAN:
   * - Vercel (hosting) sudah enable Brotli compression (lebih bagus dari Gzip)
   * - Setting ini untuk development & fallback
   */
  compress: true,

  // ============================================================
  // 3. POWEREDBYHEADER (Remove X-Powered-By)
  // ============================================================
  /**
   * poweredByHeader: false = Hilangkan header "X-Powered-By: Next.js"
   * 
   * KENAPA:
   * - Security: Jangan expose teknologi yang dipakai
   * - Hacker bisa target vulnerabilities spesifik Next.js
   * - Best practice: Minimal information disclosure
   * 
   * SEBELUM:
   * Response Headers:
   *   X-Powered-By: Next.js
   * 
   * SESUDAH:
   * Response Headers:
   *   (tidak ada X-Powered-By)
   */
  poweredByHeader: false,

  // ============================================================
  // 4. REACTSTRICTMODE (Development Best Practice)
  // ============================================================
  /**
   * reactStrictMode: Enable React Strict Mode
   * 
   * FUNGSI:
   * - Detect potential problems di development
   * - Warning untuk deprecated API
   * - Warning untuk unsafe lifecycle methods
   * - Double-render components (detect side effects)
   * 
   * KENAPA PENTING:
   * - Catch bugs lebih awal
   * - Code lebih future-proof
   * - Best practice React
   * 
   * CATATAN:
   * - Hanya aktif di development mode
   * - Production mode = tidak ada impact performa
   */
  reactStrictMode: true,

  // ============================================================
  // 5. SWCMINIFY (Faster Build)
  // ============================================================
  /**
   * swcMinify: Use SWC untuk minification (bukan Terser)
   * 
   * SWC:
   * - Written in Rust = super cepat
   * - 17x lebih cepat dari Terser
   * - 7x lebih cepat dari Babel
   * 
   * MINIFICATION:
   * - Remove whitespace
   * - Shorten variable names
   * - Remove comments
   * - Optimize code
   * 
   * CONTOH:
   * Before minify:
   *   const userName = "John Doe"
   *   console.log("Hello, " + userName)
   * 
   * After minify:
   *   const a="John Doe";console.log("Hello, "+a)
   * 
   * IMPACT:
   * - Build time: 10 menit → 2 menit
   * - Bundle size: 500KB → 250KB
   */
  swcMinify: true,

  // ============================================================
  // 6. TRAILING SLASH (URL Consistency)
  // ============================================================
  /**
   * trailingSlash: false = URL tanpa trailing slash
   * 
   * DENGAN FALSE:
   * - /phones/samsung-s24 ✅
   * - /phones/samsung-s24/ ❌ (redirect ke tanpa slash)
   * 
   * DENGAN TRUE:
   * - /phones/samsung-s24/ ✅
   * - /phones/samsung-s24 ❌ (redirect ke dengan slash)
   * 
   * KENAPA PENTING UNTUK SEO:
   * - Consistency = Prevent duplicate content
   * - Google index salah satu versi saja
   * - Canonical URL lebih jelas
   * 
   * REKOMENDASI:
   * - false = Lebih clean, standar modern
   * - true = Jika butuh compatibility dengan old systems
   */
  trailingSlash: false,

  // ============================================================
  // 7. EXPERIMENTAL FEATURES (Optional)
  // ============================================================
  /**
   * experimental: Features yang masih beta tapi berguna
   * 
   * CATATAN:
   * - Uncomment jika mau pakai
   * - Test di development dulu
   * - Monitor jika ada breaking changes
   */
  // experimental: {
  //   // optimizeCss: true,  // Optimize CSS dengan Lightning CSS
  //   // optimizePackageImports: ['lodash', 'date-fns'],  // Optimize imports
  // },

  // ============================================================
  // 8. REDIRECTS (URL Management)
  // ============================================================
  /**
   * redirects: Redirect URL lama ke URL baru
   * 
   * CONTOH USE CASE:
   * - Rename URL: /old-page → /new-page
   * - Remove page: /removed → /
   * - Consolidate: /about-us → /about
   * 
   * KENAPA PENTING UNTUK SEO:
   * - Preserve link equity dari URL lama
   * - Prevent 404 errors
   * - Guide users & search engines ke halaman yang benar
   */
  async redirects() {
    return [
      // CONTOH: Redirect /smartphones ke /phones
      // {
      //   source: '/smartphones',
      //   destination: '/phones',
      //   permanent: true,  // 301 redirect (SEO-friendly)
      // },
      // CONTOH: Redirect /search ke /phones dengan filter
      // {
      //   source: '/search',
      //   destination: '/phones',
      //   permanent: false,  // 302 redirect (temporary)
      // },
    ]
  },

  // ============================================================
  // 9. HEADERS (Security & Performance)
  // ============================================================
  /**
   * headers: Custom HTTP headers untuk security & caching
   * 
   * SECURITY HEADERS:
   * - X-Frame-Options: Prevent clickjacking
   * - X-Content-Type-Options: Prevent MIME sniffing
   * - X-XSS-Protection: Enable XSS filter
   * - Referrer-Policy: Control referrer information
   * 
   * CACHING HEADERS:
   * - Cache-Control: How long browser cache files
   * 
   * SEO IMPACT:
   * - Security = Trust signals
   * - Caching = Faster loading
   */
  async headers() {
    return [
      {
        source: '/:path*',  // Apply to all pages
        headers: [
          // ============================================================
          // SECURITY HEADERS
          // ============================================================
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',  // Prevent iframe embedding (except same domain)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',  // Prevent MIME type sniffing
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',  // Enable XSS filter
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',  // Control referrer info
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',  // Disable unused features
          },
        ],
      },
      // ============================================================
      // CACHING UNTUK STATIC ASSETS
      // ============================================================
      {
        source: '/:path*.{jpg,jpeg,png,gif,svg,ico,webp,avif}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',  // Cache 1 year
          },
        ],
      },
    ]
  },
};

export default nextConfig;

// ============================================================
// TESTING & VERIFICATION
// ============================================================
/**
 * SETELAH UPDATE CONFIG:
 * 
 * 1. Restart dev server:
 *    - Stop: Ctrl+C
 *    - Start: npm run dev
 * 
 * 2. Test images:
 *    - Buka halaman dengan gambar HP
 *    - Inspect element → Network tab
 *    - Cek format gambar (should be WebP or AVIF)
 *    - Cek size (should be smaller)
 * 
 * 3. Test compression:
 *    - Open DevTools → Network
 *    - Reload page
 *    - Cek "Transferred" size vs "Resource" size
 *    - Should see compression (smaller transferred size)
 * 
 * 4. Test headers:
 *    - Open DevTools → Network
 *    - Click any request
 *    - Check Response Headers
 *    - Should see security headers
 * 
 * 5. Build production:
 *    npm run build
 *    - Check bundle size
 *    - Should be smaller dengan minify
 */

// ============================================================
// PERFORMANCE TESTING TOOLS
// ============================================================
/**
 * SETELAH DEPLOY, TEST DENGAN:
 * 
 * 1. Google PageSpeed Insights:
 *    https://pagespeed.web.dev/
 *    - Test mobile & desktop
 *    - Target: Score 90+
 *    - Focus: Core Web Vitals (LCP, FID, CLS)
 * 
 * 2. GTmetrix:
 *    https://gtmetrix.com/
 *    - Detailed waterfall analysis
 *    - Recommendations
 * 
 * 3. WebPageTest:
 *    https://www.webpagetest.org/
 *    - Test dari berbagai lokasi
 *    - Filmstrip view
 * 
 * 4. Chrome Lighthouse:
 *    - Open DevTools
 *    - Lighthouse tab
 *    - Run audit
 *    - Target: 90+ untuk Performance & SEO
 */

// ============================================================
// MONITORING PRODUCTION
// ============================================================
/**
 * TOOLS UNTUK MONITOR PERFORMA:
 * 
 * 1. Vercel Analytics (Built-in):
 *    - Real user metrics
 *    - Core Web Vitals
 *    - Geographic data
 * 
 * 2. Google Search Console:
 *    - Core Web Vitals report
 *    - URL-level data
 *    - Mobile usability
 * 
 * 3. Google Analytics 4:
 *    - User behavior
 *    - Page load times
 *    - Bounce rate
 * 
 * TARGET METRICS:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - FID (First Input Delay): < 100ms
 * - CLS (Cumulative Layout Shift): < 0.1
 * - TTI (Time to Interactive): < 3.8s
 * - Speed Index: < 3.4s
 */