import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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

// Ambil HP terbaru dari database
async function getLatestPhones() {
  const { data, error } = await supabase
    .from('phones')
    .select(`
      id, name, slug, image_url, price_min, chipset, ram,
      brands ( name )
    `)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Error:', error)
    return []
  }
  return data ?? []
}

// Ambil brands populer
async function getBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name, slug')
    .order('name', { ascending: true })
    .limit(8)

  if (error) return []
  return data ?? []
}

// Ambil statistik
async function getStats() {
  const { count: phonesCount } = await supabase
    .from('phones')
    .select('*', { count: 'exact', head: true })

  const { count: brandsCount } = await supabase
    .from('brands')
    .select('*', { count: 'exact', head: true })

  const { count: reviewsCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })

  return {
    phones: phonesCount || 0,
    brands: brandsCount || 0,
    reviews: reviewsCount || 0
  }
}

export default async function Home() {
  const phones = await getLatestPhones()
  const brands = await getBrands()
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900">
      {/* Header / Navbar */}
      <header className="bg-slate-900/50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">����</span>
              <span className="text-xl font-bold text-white">
                CekSpek<span className="text-blue-400">.id</span>
              </span>
            </Link>
            
            {/* Navigation */}
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

            {/* Search Bar */}
            <Link href="/search" className="flex items-center">
              <div className="relative">
                <div className="bg-slate-800 text-slate-400 px-4 py-2 pl-10 rounded-lg border border-slate-600 hover:border-blue-500 transition cursor-pointer w-48 md:w-64">
                  Cari smartphone...
                </div>
                <span className="absolute left-3 top-2.5 text-slate-400">
                  🔍
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Temukan Smartphone
            <span className="text-blue-400"> Impianmu</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-slate-300 mb-8">
            Bandingkan spesifikasi, baca review, dan temukan HP terbaik 
            sesuai budget kamu. Database lengkap smartphone Indonesia.
          </p>

          {/* Search Box Hero */}
          <Link href="/search">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-xl mx-auto hover:border-blue-500 transition cursor-pointer">
              <div className="relative">
                <div className="w-full bg-slate-900 text-slate-400 px-5 py-4 pl-12 rounded-xl border border-slate-600 text-lg text-left">
                  Ketik nama HP... (contoh: Samsung Galaxy S24)
                </div>
                <span className="absolute left-4 top-4 text-2xl">
                  🔍
                </span>
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="text-slate-400 text-sm">Populer:</span>
                <span className="text-blue-400 text-sm">iPhone 16 Pro</span>
                <span className="text-blue-400 text-sm">Samsung S24 Ultra</span>
                <span className="text-blue-400 text-sm">Xiaomi 14</span>
              </div>
            </div>
          </Link>

          {/* Stats - Dynamic dari Database */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.phones}+</div>
              <div className="text-slate-400">Smartphone</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.brands}+</div>
              <div className="text-slate-400">Brand</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.reviews}+</div>
              <div className="text-slate-400">Reviews</div>
            </div>
          </div>
        </div>

        {/* Brand Logos - Dynamic dari Database */}
        <div className="mt-20">
          <p className="text-center text-slate-400 mb-8">Brand Populer</p>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand: any) => (
              <Link 
                key={brand.id}
                href={`/phones?brand=${brand.slug}`}
                className="bg-slate-800 px-6 py-3 rounded-lg border border-slate-700 hover:border-blue-500 transition cursor-pointer"
              >
                <span className="text-white font-medium">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Phones - Dynamic dari Database */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              📱 Smartphone Unggulan
            </h2>
            <Link 
              href="/phones"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Lihat Semua →
            </Link>
          </div>
          
          {phones.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {phones.map((phone: any) => (
                <Link key={phone.id} href={`/phones/${phone.slug}`}>
                  <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500 transition group">
                    <div className="aspect-square bg-slate-700 flex items-center justify-center">
                      {phone.image_url ? (
                        <img 
                          src={phone.image_url}
                          alt={phone.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-6xl">📱</span>
                          <p className="text-slate-500 text-sm mt-2">{phone.brands?.name}</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-blue-400 text-sm">{phone.brands?.name}</p>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition line-clamp-2 min-h-[48px]">
                        {phone.name}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-1">
                        {phone.chipset} • {phone.ram}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-blue-400 font-bold">
                          {formatPrice(phone.price_min)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
              <span className="text-4xl mb-4 block">📱</span>
              <p className="text-slate-400">Belum ada smartphone unggulan</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            🚀 Mulai Sekarang
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Cari HP */}
            <Link href="/search">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition text-center group h-full">
                <span className="text-4xl mb-4 block">🔍</span>
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition">
                  Cari Smartphone
                </h3>
                <p className="text-slate-400 text-sm">
                  Temukan HP berdasarkan nama atau spesifikasi
                </p>
              </div>
            </Link>

            {/* Bandingkan */}
            <Link href="/compare">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition text-center group h-full">
                <span className="text-4xl mb-4 block">⚖️</span>
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition">
                  Bandingkan HP
                </h3>
                <p className="text-slate-400 text-sm">
                  Bandingkan spesifikasi 2-3 smartphone sekaligus
                </p>
              </div>
            </Link>

            {/* Lihat Semua */}
            <Link href="/phones">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition text-center group h-full">
                <span className="text-4xl mb-4 block">📱</span>
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition">
                  Semua Smartphone
                </h3>
                <p className="text-slate-400 text-sm">
                  Jelajahi {stats.phones}+ smartphone dari {stats.brands}+ brand
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-400">
            <p>© 2025 CekSpek.id - Database Spesifikasi Smartphone Indonesia</p>
            <p className="text-sm mt-2">
              Dibuat dengan ❤️ untuk membantu kamu memilih smartphone terbaik
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}