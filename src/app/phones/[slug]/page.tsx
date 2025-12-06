import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReviewList from '@/components/ReviewList'
import AffiliateSection from '@/components/AffiliateSection'

// Fungsi format harga
function formatPrice(price: number | null): string {
  if (!price) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Fungsi format tanggal
function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Komponen untuk menampilkan spesifikasi
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

// Komponen Section Spesifikasi
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

// Ambil data HP berdasarkan slug
async function getPhone(slug: string) {
  const { data, error } = await supabase
    .from('phones')
    .select(`*, brands ( name, slug )`)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

// Ambil reviews untuk HP ini
async function getReviews(phoneId: number) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('phone_id', phoneId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

// Halaman Detail HP
export default async function PhoneDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
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
            {/* Brand Badge */}
            <div className="inline-block bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-sm mb-4">
              {phone.brands?.name}
            </div>

            {/* Nama HP */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {phone.name}
            </h1>

            {/* Rating */}
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

            {/* Harga */}
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

            {/* Quick Specs */}
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

        {/* Affiliate Section */}
        <AffiliateSection
          phoneName={phone.name}
          priceMin={phone.price_min}
          priceMax={phone.price_max}
          shopeeLink={phone.shopee_link}
          tokopediaLink={phone.tokopedia_link}
        />

        {/* Spesifikasi Lengkap */}
        <h2 className="text-2xl font-bold text-white mb-6">📋 Spesifikasi Lengkap</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kolom Kiri */}
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

          {/* Kolom Kanan */}
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

        {/* Reviews Section */}
        <ReviewList phoneId={phone.id} initialReviews={reviews} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>© 2025 CekSpek.id - Database Spesifikasi Smartphone Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  )
}