// src/components/PhoneSchema.tsx
/**
 * ============================================================
 * PHONE SCHEMA COMPONENT - STRUCTURED DATA / RICH SNIPPETS
 * ============================================================
 * 
 * FUNGSI: Generate JSON-LD Structured Data untuk Google Rich Results
 * 
 * APA ITU STRUCTURED DATA / SCHEMA.ORG?
 * - Format standar untuk memberitahu search engine tentang konten halaman
 * - Menggunakan vocabular dari Schema.org
 * - Format JSON-LD (JavaScript Object Notation for Linked Data)
 * - Google membaca data ini untuk tampilkan Rich Results/Rich Snippets
 * 
 * APA ITU RICH RESULTS?
 * Rich results = Hasil pencarian Google yang lebih menarik dengan data tambahan
 * 
 * CONTOH TAMPILAN DI GOOGLE UNTUK HP:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Samsung Galaxy S24 Ultra | CekSpek.id                  │
 * │ https://cekspek.vercel.app/phones/...                  │
 * │                                                         │
 * │ ⭐⭐⭐⭐⭐ 4.8 (234 reviews)                            │
 * │ 💰 Rp 19.999.000                                       │
 * │                                                         │
 * │ [Gambar HP]  Spesifikasi lengkap Samsung Galaxy S24...│
 * │                                                         │
 * └─────────────────────────────────────────────────────────┘
 * 
 * TANPA STRUCTURED DATA:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Samsung Galaxy S24 Ultra | CekSpek.id                  │
 * │ https://cekspek.vercel.app/phones/...                  │
 * │                                                         │
 * │ Spesifikasi lengkap Samsung Galaxy S24 Ultra:         │
 * │ Layar 6.8" Dynamic AMOLED...                          │
 * │                                                         │
 * └─────────────────────────────────────────────────────────┘
 * 
 * IMPACT SEO:
 * - CTR (Click Through Rate) lebih tinggi: 20-30% increase
 * - Trust signals: Rating bintang = kredibilitas
 * - Visual appeal: Lebih menarik dibanding hasil biasa
 * - Ranking tidak langsung meningkat, tapi CTR tinggi = signal positif
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================
type PhoneSchemaProps = {
  phone: {
    // Basic Info
    name: string                    // "Samsung Galaxy S24 Ultra"
    brand: string                   // "Samsung"
    slug: string                    // "samsung-galaxy-s24-ultra"
    image_url: string              // URL foto HP
    
    // Pricing
    price_min: number | null       // Harga terendah
    price_max: number | null       // Harga tertinggi
    
    // Rating & Reviews
    rating?: number                // Average rating (0-5)
    review_count?: number          // Jumlah review
    
    // Additional Info
    description?: string | null    // Deskripsi singkat
    release_date?: string | null   // Tanggal rilis
    
    // Specifications (untuk deskripsi)
    display_size?: string          // "6.8"
    display_type?: string          // "Dynamic AMOLED 2X"
    chipset?: string               // "Snapdragon 8 Gen 3"
    camera_main?: string           // "200 MP"
    battery_capacity?: number      // 5000
  }
}

// ============================================================
// PHONE SCHEMA COMPONENT
// ============================================================
export default function PhoneSchema({ phone }: PhoneSchemaProps) {
  // ============================================================
  // BUILD DESCRIPTION
  // ============================================================
  /**
   * Generate deskripsi otomatis dari spek HP
   * Jika ada description dari database, pakai itu
   * Jika tidak, generate dari spek utama
   */
  const description = phone.description || 
    `${phone.name} dengan layar ${phone.display_size}" ${phone.display_type}, ${phone.chipset}, kamera ${phone.camera_main}, dan baterai ${phone.battery_capacity}mAh. Spesifikasi lengkap, harga terbaik, dan review pengguna di CekSpek.id.`

  // ============================================================
  // BUILD PRICE
  // ============================================================
  /**
   * Tentukan harga untuk ditampilkan
   * - Jika ada range: pakai harga minimum
   * - Jika tidak ada harga: pakai 0 (atau bisa skip offers)
   */
  const price = phone.price_min || phone.price_max || 0

  // ============================================================
  // BUILD STRUCTURED DATA (JSON-LD)
  // ============================================================
  /**
   * Format JSON-LD sesuai standar Schema.org
   * Type: Product (karena HP adalah produk)
   * 
   * DOKUMENTASI SCHEMA.ORG:
   * https://schema.org/Product
   * 
   * GOOGLE VALIDATOR:
   * https://search.google.com/test/rich-results
   */
  const schema = {
    // ============================================================
    // 1. CONTEXT & TYPE
    // ============================================================
    /**
     * @context: Vocabulary yang dipakai (selalu https://schema.org)
     * @type: Tipe data (Product untuk smartphone)
     */
    '@context': 'https://schema.org',
    '@type': 'Product',
    
    // ============================================================
    // 2. BASIC INFORMATION
    // ============================================================
    /**
     * name: Nama produk
     * PENTING: Harus exact match dengan <h1> di halaman
     */
    name: phone.name,
    
    /**
     * image: URL gambar produk
     * PENTING:
     * - Harus URL lengkap (https://...)
     * - Minimal 1200x630px
     * - Format: JPG, PNG, WebP
     * - Gambar harus jelas menunjukkan produk
     * 
     * Bisa array jika ada multiple gambar:
     * image: [url1, url2, url3]
     */
    image: phone.image_url,
    
    /**
     * description: Deskripsi produk
     * TIPS:
     * - 50-300 karakter
     * - Jelas, informatif, include spek utama
     * - Jangan copy dari deskripsi meta (variasi lebih baik)
     */
    description: description,
    
    // ============================================================
    // 3. BRAND
    // ============================================================
    /**
     * brand: Informasi brand/manufacturer
     * 
     * BISA SIMPLE STRING:
     * brand: "Samsung"
     * 
     * ATAU OBJECT BRAND (LEBIH BAIK):
     * brand: {
     *   @type: "Brand",
     *   name: "Samsung"
     * }
     * 
     * MANFAAT OBJECT:
     * - Google bisa link ke brand entity
     * - Bisa tambah info brand lain (logo, website, dll)
     */
    brand: {
      '@type': 'Brand',
      name: phone.brand,
      // Optional: Logo brand
      // logo: `https://cekspek.vercel.app/brands/${phone.brand.toLowerCase()}-logo.png`
    },
    
    // ============================================================
    // 4. SKU & IDENTIFIER
    // ============================================================
    /**
     * sku: Stock Keeping Unit (ID unik produk)
     * Pakai slug sebagai SKU
     * 
     * ALTERNATIF:
     * - Model number: "SM-S928B"
     * - Internal ID: phone.id
     * - GTIN/UPC/EAN jika ada
     */
    sku: phone.slug,
    
    // ============================================================
    // 5. OFFERS (Harga & Availability)
    // ============================================================
    /**
     * offers: Informasi harga & ketersediaan
     * 
     * STRUKTUR:
     * - @type: Offer (penawaran tunggal)
     * - url: URL halaman pembelian
     * - priceCurrency: Mata uang (ISO 4217 code)
     * - price: Harga numerik
     * - availability: Status stock
     * - priceValidUntil: Harga valid sampai kapan (opsional)
     * 
     * AVAILABILITY OPTIONS:
     * - InStock: Ada stock
     * - OutOfStock: Habis stock
     * - PreOrder: Pre-order
     * - Discontinued: Tidak diproduksi lagi
     * - LimitedAvailability: Stock terbatas
     * 
     * UNTUK MULTIPLE SELLERS:
     * offers: [
     *   { seller: "Shopee", price: 19999000 },
     *   { seller: "Tokopedia", price: 19899000 }
     * ]
     */
    offers: {
      '@type': 'Offer',
      url: `https://cekspek.vercel.app/phones/${phone.slug}`,
      priceCurrency: 'IDR',  // Indonesian Rupiah
      price: price,
      
      /**
       * availability: Status ketersediaan produk
       * UNTUK HP BARU: InStock
       * UNTUK HP LAMA: Bisa OutOfStock atau Discontinued
       */
      availability: 'https://schema.org/InStock',
      
      /**
       * seller: Penjual/marketplace
       * Optional, bisa skip jika tidak spesifik
       */
      // seller: {
      //   '@type': 'Organization',
      //   name: 'CekSpek.id'
      // },
      
      /**
       * priceValidUntil: Sampai kapan harga ini berlaku
       * Optional, berguna untuk promo
       * Format: ISO 8601 date (YYYY-MM-DD)
       */
      // priceValidUntil: '2025-12-31',
    },
    
    // ============================================================
    // 6. AGGREGATE RATING (Rating & Reviews)
    // ============================================================
    /**
     * aggregateRating: Rating rata-rata & jumlah review
     * 
     * KENAPA PENTING:
     * - Muncul sebagai bintang di hasil pencarian ⭐⭐⭐⭐⭐
     * - Meningkatkan CTR sampai 30%
     * - Trust signal yang kuat
     * 
     * REQUIREMENTS GOOGLE:
     * - Minimal 1 review untuk tampil
     * - ratingValue: 0-5 (atau scale lain, specify di bestRating)
     * - reviewCount: Harus akurat (Google bisa validasi)
     * 
     * CONDITIONAL:
     * - Hanya include jika ada minimal 1 review
     * - Jika tidak ada review: undefined (akan di-skip)
     */
    aggregateRating: phone.review_count && phone.review_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: phone.rating || 0,      // Rating rata-rata (contoh: 4.8)
      reviewCount: phone.review_count,     // Jumlah total review (contoh: 234)
      bestRating: 5,                       // Rating maksimal (5 bintang)
      worstRating: 1,                      // Rating minimal (1 bintang)
    } : undefined,
    
    // ============================================================
    // 7. REVIEW (Individual Reviews)
    // ============================================================
    /**
     * review: Array individual reviews
     * 
     * Optional, tapi bisa improve rich results
     * Google bisa tampilkan review quotes
     * 
     * STRUKTUR:
     * review: [
     *   {
     *     @type: "Review",
     *     author: "John Doe",
     *     datePublished: "2025-01-01",
     *     reviewBody: "Kamera sangat bagus!",
     *     reviewRating: {
     *       @type: "Rating",
     *       ratingValue: 5
     *     }
     *   }
     * ]
     * 
     * UNTUK IMPLEMENTASI:
     * Bisa fetch top 5 reviews dari database dan include di sini
     * Untuk sekarang kita skip dulu (optional)
     */
    
    // ============================================================
    // 8. ADDITIONAL PROPERTIES (Optional)
    // ============================================================
    /**
     * releaseDate: Tanggal rilis produk
     * Format: ISO 8601 date (YYYY-MM-DD)
     */
    releaseDate: phone.release_date,
    
    /**
     * category: Kategori produk
     * Membantu Google understand context
     */
    category: 'Electronics > Mobile Phones > Smartphones',
    
    /**
     * additionalProperty: Spesifikasi teknis
     * Array of PropertyValue
     * 
     * CONTOH:
     * additionalProperty: [
     *   {
     *     @type: "PropertyValue",
     *     name: "Display Size",
     *     value: "6.8 inch"
     *   },
     *   {
     *     @type: "PropertyValue",
     *     name: "Chipset",
     *     value: "Snapdragon 8 Gen 3"
     *   }
     * ]
     * 
     * Optional, tidak wajib, tapi bisa improve relevance
     */
  }

  // ============================================================
  // RENDER JSON-LD SCRIPT TAG
  // ============================================================
  /**
   * CARA KERJA:
   * 1. Convert object JavaScript ke JSON string
   * 2. Inject ke <script type="application/ld+json">
   * 3. Google crawl halaman, baca script ini
   * 4. Parse JSON, extract data
   * 5. Generate rich results jika valid
   * 
   * PENTING:
   * - type HARUS "application/ld+json"
   * - dangerouslySetInnerHTML diperlukan untuk inject JSON
   * - JSON harus valid (gunakan JSON.stringify)
   * 
   * DIMANA COMPONENT INI DIPAKAI:
   * Di halaman detail HP: src/app/phones/[slug]/page.tsx
   * 
   * CONTOH USAGE:
   * <PhoneSchema phone={phone} />
   */
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ============================================================
// CARA IMPLEMENTASI DI HALAMAN DETAIL HP
// ============================================================
/**
 * FILE: src/app/phones/[slug]/page.tsx
 * 
 * IMPORT COMPONENT:
 * import PhoneSchema from '@/components/PhoneSchema'
 * 
 * TAMBAHKAN DI COMPONENT:
 * export default async function PhoneDetailPage({ params }: Props) {
 *   const phone = await getPhone(params.slug)
 *   
 *   return (
 *     <>
 *       <PhoneSchema phone={phone} />  // ← Tambahkan di sini (di dalam <>)
 *       
 *       <div className="page-content">
 *         // ... konten halaman
 *       </div>
 *     </>
 *   )
 * }
 * 
 * POSISI:
 * - Bisa di mana saja dalam component (biasanya di awal)
 * - Script akan di-inject di <head> otomatis oleh Next.js
 * - Tidak tampil di UI, hanya dibaca oleh Google
 */

// ============================================================
// TESTING STRUCTURED DATA
// ============================================================
/**
 * SETELAH IMPLEMENTASI:
 * 
 * 1. GOOGLE RICH RESULTS TEST:
 *    https://search.google.com/test/rich-results
 *    
 *    - Paste URL halaman HP Anda
 *    - Atau paste HTML source code
 *    - Google akan validasi struktur data
 *    - Cek apakah ada error atau warning
 *    - Preview rich results
 * 
 * 2. SCHEMA MARKUP VALIDATOR:
 *    https://validator.schema.org/
 *    
 *    - Paste JSON-LD Anda
 *    - Validasi against schema.org spec
 *    - Cek apakah structure benar
 * 
 * 3. CEK DI BROWSER:
 *    - View page source (Ctrl+U)
 *    - Cari <script type="application/ld+json">
 *    - Pastikan JSON valid dan lengkap
 *    - Copy JSON, paste ke JSON validator
 * 
 * 4. GOOGLE SEARCH CONSOLE:
 *    - Pergi ke: Enhancements → Products
 *    - Lihat berapa halaman dengan valid product markup
 *    - Cek jika ada error per URL
 *    - Request indexing untuk halaman baru
 * 
 * 5. TEST LIVE DI GOOGLE:
 *    - Deploy ke production
 *    - Tunggu 1-7 hari untuk Google crawl
 *    - Search "site:cekspek.vercel.app samsung galaxy s24"
 *    - Lihat apakah rich results muncul
 */

// ============================================================
// TROUBLESHOOTING
// ============================================================
/**
 * PROBLEM: Rich results tidak muncul di Google
 * 
 * POSSIBLE CAUSES & SOLUTIONS:
 * 
 * 1. JSON tidak valid:
 *    - Test dengan JSON validator
 *    - Pastikan tidak ada syntax error
 *    - Cek quotes, commas, brackets
 * 
 * 2. Required fields missing:
 *    - name, image, offers adalah WAJIB
 *    - Pastikan semua terisi
 *    - Cek dengan Rich Results Test
 * 
 * 3. Image issues:
 *    - URL harus accessible (tidak 404)
 *    - Minimal size 1200x630px
 *    - Format support: JPG, PNG, WebP
 *    - Tidak boleh behind login/paywall
 * 
 * 4. Price issues:
 *    - Price harus numeric, bukan string
 *    - Currency code harus valid (IDR, USD, dll)
 *    - Availability harus valid schema.org value
 * 
 * 5. Rating issues:
 *    - Minimal 1 review untuk tampil
 *    - ratingValue harus 0-5 (atau sesuai scale)
 *    - reviewCount harus > 0
 *    - Tidak boleh fake reviews (Google bisa detect)
 * 
 * 6. Belum di-crawl:
 *    - Rich results tidak instant
 *    - Bisa muncul 1-7 hari setelah crawl
 *    - Force crawl via Google Search Console
 *    - Submit sitemap untuk mempercepat
 * 
 * 7. Manual action:
 *    - Cek Google Search Console → Manual Actions
 *    - Pastikan tidak ada penalty
 *    - Fix issues jika ada
 */

// ============================================================
// BEST PRACTICES
// ============================================================
/**
 * 1. CONSISTENCY:
 *    - Data di JSON-LD harus match dengan visible content
 *    - Price di schema = price di halaman
 *    - Rating di schema = rating yang ditampilkan
 * 
 * 2. ACCURACY:
 *    - Jangan inflate ratings
 *    - Jangan fake review count
 *    - Google bisa detect dan penalty website
 * 
 * 3. COMPLETENESS:
 *    - Fill semua required fields
 *    - Include optional fields jika ada data
 *    - Lebih lengkap = lebih baik
 * 
 * 4. VALIDATION:
 *    - Test di Rich Results Test sebelum deploy
 *    - Fix semua error dan warning
 *    - Re-test after changes
 * 
 * 5. MONITORING:
 *    - Monitor di Google Search Console
 *    - Check product enhancements report
 *    - Fix issues promptly
 * 
 * 6. UPDATE:
 *    - Update schema saat data berubah
 *    - Price change = update schema
 *    - New reviews = update aggregateRating
 */

// ============================================================
// SCHEMA.ORG TYPES LAIN (Future)
// ============================================================
/**
 * Untuk website CekSpek.id, bisa tambah schema types lain:
 * 
 * 1. BREADCRUMB:
 *    - Home > Phones > Samsung > Galaxy S24
 *    - Tampil sebagai breadcrumb di Google
 * 
 * 2. WEBSITE:
 *    - Info about website
 *    - Search box di Google results
 * 
 * 3. ORGANIZATION:
 *    - Info tentang CekSpek.id
 *    - Logo, social profiles, contact
 * 
 * 4. FAQ:
 *    - Frequently Asked Questions
 *    - Expandable dalam hasil pencarian
 * 
 * 5. HOW-TO:
 *    - Tutorial (misal: cara memilih HP)
 *    - Step by step di Google
 * 
 * Implement nanti setelah Product schema stabil!
 */