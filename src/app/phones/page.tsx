// src/app/phones/[slug]/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReviewList from '@/components/ReviewList'
import AffiliateSection from '@/components/AffiliateSection'
import { Metadata } from 'next'
import PhoneSchema from '@/components/PhoneSchema'

// ============================================================
// TYPE DEFINITIONS
// ============================================================
type Props = {
  params: Promise<{ slug: string }>
}

// ============================================================
// GENERATE METADATA DINAMIS - SEO OPTIMIZATION
// ============================================================
/**
 * FUNGSI: generateMetadata()
 * 
 * Fungsi khusus Next.js yang berjalan SEBELUM halaman di-render.
 * Digunakan untuk membuat metadata SEO yang berbeda untuk setiap HP.
 * 
 * KENAPA PENTING:
 * - Setiap HP punya metadata sendiri (judul, deskripsi, gambar)
 * - Google akan index setiap halaman dengan informasi yang relevan
 * - Preview di social media akan menampilkan info HP yang tepat
 * 
 * CARA KERJA:
 * 1. Ambil slug dari URL (contoh: /phones/samsung-galaxy-s24-ultra)
 * 2. Query database untuk data HP tersebut
 * 3. Generate metadata berdasarkan data HP
 * 4. Return metadata untuk digunakan Next.js
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  // Ambil data HP dari database
  const { data: phone } = await supabase
    .from('phones')
    .select('*, brands ( name, slug )')
    .eq('slug', slug)
    .single()

  // Jika HP tidak ditemukan, return metadata default
  if (!phone) {
    return {
      title: 'HP Tidak Ditemukan',
      description: 'Smartphone yang Anda cari tidak ditemukan di database kami.',
    }
  }

  // ============================================================
  // BUILD METADATA DINAMIS
  // ============================================================
  
  // 1. JUDUL (Title)
  // Format: "Nama HP - Spesifikasi Lengkap, Harga & Review"
  // Contoh: "Samsung Galaxy S24 Ultra - Spesifikasi Lengkap, Harga & Review"
  const title = `${phone.name} - Spesifikasi Lengkap, Harga & Review`
  
  // 2. DESKRIPSI (Description)
  // Fungsi: Ringkasan spek utama untuk Google snippet
  // Format: Include spek penting (layar, chipset, kamera, baterai, harga)
  // Tips: 150-160 karakter, padat informasi
  const description = `Spesifikasi lengkap ${phone.name}: Layar ${phone.display_size}" ${phone.display_type}, ${phone.chipset}, kamera utama ${phone.camera_main}, baterai ${phone.battery_capacity}mAh. Cek harga terbaik dan review dari pengguna.`
  
  // 3. KEYWORDS
  // Fungsi: Kata kunci spesifik untuk HP ini
  // Include: nama HP, brand, tahun rilis, chipset, fitur unggulan
  const keywords = [
    phone.name,                              // "Samsung Galaxy S24 Ultra"
    phone.brands?.name,                      // "Samsung"
    `spesifikasi ${phone.name}`,            // "spesifikasi Samsung Galaxy S24 Ultra"
    `harga ${phone.name}`,                  // "harga Samsung Galaxy S24 Ultra"
    `review ${phone.name}`,                 // "review Samsung Galaxy S24 Ultra"
    phone.chipset,                           // "Snapdragon 8 Gen 3"
    `${phone.brands?.name} ${phone.release_year || '2024'}`,  // "Samsung 2024"
    `hp ${phone.brands?.name?.toLowerCase()}`,  // "hp samsung"
  ]

  // 4. RETURN METADATA OBJECT
  return {
    // Basic Metadata
    title,           // Akan jadi: "Samsung Galaxy S24 Ultra | CekSpek.id" (karena template)
    description,
    keywords,
    
    // ============================================================
    // OPEN GRAPH (Facebook, WhatsApp, LinkedIn)
    // ============================================================
    /**
     * FUNGSI: Preview card di social media
     * 
     * KETIKA USER SHARE LINK:
     * - Judul: Nama HP + brand
     * - Deskripsi: Spek singkat
     * - Gambar: Foto HP
     * - URL: Link ke halaman HP
     * 
     * CONTOH HASIL:
     * ┌─────────────────────────────────────┐
     * │ [Gambar Samsung S24 Ultra]          │
     * │                                     │
     * │ Samsung Galaxy S24 Ultra            │
     * │ Spesifikasi lengkap: 6.8" AMOLED...│
     * │                                     │
     * │ cekspek.vercel.app                  │
     * └─────────────────────────────────────┘
     */
    openGraph: {
      title,
      description,
      type: 'article',  // 'article' untuk konten detail (bukan 'website')
      url: `https://cekspek.vercel.app/phones/${slug}`,
      siteName: 'CekSpek.id',
      locale: 'id_ID',
      images: [
        {
          url: phone.image_url || '/placeholder-phone.jpg',  // Fallback jika tidak ada gambar
          width: 800,
          height: 600,
          alt: `Foto ${phone.name}`,  // Alt text untuk accessibility
          type: 'image/jpeg',
        },
      ],
      // Metadata tambahan untuk artikel
      publishedTime: phone.created_at,  // Kapan HP ditambahkan ke database
      modifiedTime: phone.updated_at,   // Kapan terakhir diupdate
      authors: ['CekSpek.id Team'],
      tags: keywords,  // Tag untuk kategorisasi
    },
    
    // ============================================================
    // TWITTER CARD
    // ============================================================
    /**
     * FUNGSI: Preview khusus untuk Twitter/X
     * 
     * summary_large_image = Card besar dengan gambar dominan
     * Tampilan di Twitter akan lebih menarik dan clickable
     */
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [phone.image_url || '/placeholder-phone.jpg'],
      creator: '@cekspekid',  // Ganti dengan Twitter handle Anda
    },
    
    // ============================================================
    // CANONICAL URL
    // ============================================================
    /**
     * FUNGSI: Mencegah duplicate content
     * 
     * Memberitahu Google bahwa ini adalah URL utama/resmi untuk HP ini.
     * Penting jika ada banyak URL yang mengarah ke halaman sama.
     */
    alternates: {
      canonical: `https://cekspek.vercel.app/phones/${slug}`,
    },
    
    // ============================================================
    // ROBOTS (Override dari layout.tsx jika perlu)
    // ============================================================
    /**
     * FUNGSI: Kontrol crawling per halaman
     * 
     * Untuk halaman HP: semua boleh diindex dan diikuti
     * Jika ada halaman yang tidak mau diindex (misal HP discontinued),
     * bisa set robots: { index: false }
     */
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

// ============================================================
// FUNGSI HELPER (tidak berubah dari kode sebelumnya)
// ============================================================
function formatPrice(price: number | null): string {
  if (!price) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function SpecItem({ label, value }: { label: string; value: string | number | boolean | null }) {
  if (value === null || value === undefined || value === '') return null
  
  let displayValue = value
  if (typeof value === 'boolean') {
    displayValue = value ? 'Ya' : 'Tidak'
  }
  
  return (
    <div className="flex justify-between py-2 border-b border-slate-700/50">
      <span className="text-slate-400">{label}</span>
      <span className="text-white text-right max-w-[60%]">{displayValue}</span>
    </div>
  )
}

function SpecSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}

async function getPhone(slug: string) {
  const { data, error } = await supabase
    .from('phones')
    .select(`*, brands ( name, slug )`)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

async function getReviews(phoneId: number) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('phone_id', phoneId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

// ============================================================
// HALAMAN DETAIL HP (tidak berubah)
// ============================================================
export default async function PhoneDetailPage({ params }: Props) {
  const { slug } = await params
  const phone = await getPhone(slug)

  if (!phone) {
    notFound()
  }

  const reviews = await getReviews(phone.id)
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <>
      <PhoneSchema 
        phone={{
          ...phone,
          brand: phone.brands?.name || '',
          rating: averageRating,
          review_count: reviews.length,
        }} 
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900">

      {/* Header / Navbar */}
      <header className="bg-slate-900/50 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">📱</span>
              <span className="text-xl font-bold text-white">
                CekSpek<span className="text-blue-400">.id</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/phones" className="text-slate-300 hover:text-white transition">
                Smartphone
              </Link>
              <Link href="/compare" className="text-slate-300 hover:text-white transition">
                Compare
              </Link>
              <Link href="/search" className="text-slate-300 hover:text-white transition">
                Search
              </Link>
            </nav>

            <Link 
              href="/phones"
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              ← Kembali
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link href="/phones" className="hover:text-white transition">Phones</Link>
          <span>/</span>
          <span className="text-white">{phone.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 flex items-center justify-center">
            {phone.image_url ? (
              <img 
                src={phone.image_url} 
                alt={phone.name}
                className="max-h-96 object-contain"
              />
            ) : (
              <div className="text-center py-16">
                <span className="text-9xl">📱</span>
                <p className="text-slate-400 mt-4">{phone.brands?.name}</p>
              </div>
            )}
          </div>

          {/* Info Utama */}
          <div>
            <div className="inline-block bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-sm mb-4">
              {phone.brands?.name}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {phone.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xl">
                  {'⭐'.repeat(Math.round(averageRating))}
                  {'☆'.repeat(5 - Math.round(averageRating))}
                </span>
                <span className="text-white font-medium ml-2">
                  {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                </span>
              </div>
              <span className="text-slate-400">
                ({reviews.length} reviews)
              </span>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6">
              <p className="text-slate-400 text-sm mb-1">Harga</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatPrice(phone.price_min)}
                {phone.price_max && phone.price_max !== phone.price_min && (
                  <span className="text-slate-400 font-normal"> - {formatPrice(phone.price_max)}</span>
                )}
              </p>
              {phone.release_date && (
                <p className="text-slate-400 text-sm mt-2">
                  Rilis: {formatDate(phone.release_date)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <p className="text-slate-400 text-sm">Layar</p>
                <p className="text-white font-medium">{phone.display_size}&quot; {phone.display_type}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <p className="text-slate-400 text-sm">Chipset</p>
                <p className="text-white font-medium line-clamp-1">{phone.chipset || '-'}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <p className="text-slate-400 text-sm">RAM</p>
                <p className="text-white font-medium">{phone.ram || '-'}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <p className="text-slate-400 text-sm">Baterai</p>
                <p className="text-white font-medium">{phone.battery_capacity ? `${phone.battery_capacity} mAh` : '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <AffiliateSection
          phoneName={phone.name}
          priceMin={phone.price_min}
          priceMax={phone.price_max}
          shopeeLink={phone.shopee_link}
          tokopediaLink={phone.tokopedia_link}
        />

        <h2 className="text-2xl font-bold text-white mb-6">📋 Spesifikasi Lengkap</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SpecSection title="Layar" icon="📺">
              <SpecItem label="Ukuran" value={phone.display_size ? `${phone.display_size} inch` : null} />
              <SpecItem label="Tipe" value={phone.display_type} />
              <SpecItem label="Resolusi" value={phone.display_resolution} />
              <SpecItem label="Refresh Rate" value={phone.display_refresh_rate ? `${phone.display_refresh_rate} Hz` : null} />
              <SpecItem label="Proteksi" value={phone.display_protection} />
            </SpecSection>

            <SpecSection title="Performa" icon="⚡">
              <SpecItem label="Chipset" value={phone.chipset} />
              <SpecItem label="CPU" value={phone.cpu} />
              <SpecItem label="GPU" value={phone.gpu} />
              <SpecItem label="RAM" value={phone.ram} />
              <SpecItem label="Storage" value={phone.storage} />
              <SpecItem label="Antutu Score" value={phone.antutu_score ? new Intl.NumberFormat('id-ID').format(phone.antutu_score) : null} />
            </SpecSection>

            <SpecSection title="Kamera" icon="📸">
              <SpecItem label="Kamera Utama" value={phone.camera_main} />
              <SpecItem label="Ultrawide" value={phone.camera_ultrawide} />
              <SpecItem label="Telephoto" value={phone.camera_telephoto} />
              <SpecItem label="Video" value={phone.camera_video} />
              <SpecItem label="Kamera Depan" value={phone.camera_front} />
            </SpecSection>
          </div>

          <div>
            <SpecSection title="Baterai" icon="🔋">
              <SpecItem label="Kapasitas" value={phone.battery_capacity ? `${phone.battery_capacity} mAh` : null} />
              <SpecItem label="Pengisian Daya" value={phone.battery_charging} />
              <SpecItem label="Wireless Charging" value={phone.battery_wireless} />
            </SpecSection>

            <SpecSection title="Konektivitas" icon="📡">
              <SpecItem label="Jaringan" value={phone.network} />
              <SpecItem label="SIM" value={phone.sim} />
              <SpecItem label="WiFi" value={phone.wifi} />
              <SpecItem label="Bluetooth" value={phone.bluetooth} />
              <SpecItem label="NFC" value={phone.nfc} />
              <SpecItem label="USB" value={phone.usb_type} />
              <SpecItem label="Jack Audio 3.5mm" value={phone.audio_jack} />
            </SpecSection>

            <SpecSection title="Body" icon="📐">
              <SpecItem label="Dimensi" value={phone.body_dimensions} />
              <SpecItem label="Berat" value={phone.body_weight ? `${phone.body_weight} gram` : null} />
              <SpecItem label="Material" value={phone.body_material} />
              <SpecItem label="Ketahanan" value={phone.body_protection} />
            </SpecSection>

            <SpecSection title="Keamanan & Software" icon="🔐">
              <SpecItem label="Fingerprint" value={phone.fingerprint} />
              <SpecItem label="Face Unlock" value={phone.face_unlock} />
              <SpecItem label="OS" value={phone.os} />
              <SpecItem label="UI" value={phone.ui} />
            </SpecSection>
          </div>
        </div>

        <ReviewList phoneId={phone.id} initialReviews={reviews} />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>© 2025 CekSpek.id - Database Spesifikasi Smartphone Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
      </>  
  )
}

// ============================================================
// RINGKASAN PERUBAHAN & MANFAAT SEO:
// ============================================================
/**
 * PERUBAHAN UTAMA:
 * 1. Tambah import Metadata dari next
 * 2. Tambah fungsi generateMetadata() sebelum komponen
 * 3. Metadata akan auto-generated untuk setiap HP
 * 
 * MANFAAT SEO:
 * ✅ Setiap HP punya judul unik di Google
 * ✅ Deskripsi spesifik muncul di hasil pencarian
 * ✅ Preview bagus ketika di-share di social media
 * ✅ Google dapat index semua halaman HP dengan tepat
 * ✅ Meningkatkan CTR (Click Through Rate) dari pencarian
 * 
 * CONTOH HASIL DI GOOGLE:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Samsung Galaxy S24 Ultra | CekSpek.id                  │
 * │ https://cekspek.vercel.app/phones/samsung-galaxy-s24-... │
 * │                                                         │
 * │ Spesifikasi lengkap Samsung Galaxy S24 Ultra: Layar   │
 * │ 6.8" Dynamic AMOLED, Snapdragon 8 Gen 3, kamera 200MP,│
 * │ baterai 5000mAh. Cek harga terbaik dan review...      │
 * └─────────────────────────────────────────────────────────┘
 */