import { supabase } from '@/lib/supabase'
import PhoneCard from '@/components/PhoneCard'
import Link from 'next/link'

// Ambil data HP dari Supabase
async function getPhones() {
  const { data, error } = await supabase
    .from('phones')
    .select(`
      id,
      name,
      slug,
      image_url,
      price_min,
      price_max,
      display_size,
      chipset,
      ram,
      battery_capacity,
      brands (
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching phones:', error)
    return []
  }

  return data ?? []
}

// Ambil data Brand dari Supabase
async function getBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name, slug')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return data ?? []
}

// Ambil rating rata-rata per HP
async function getAverageRatings(): Promise<Record<number, number>> {
  const { data, error } = await supabase
    .from('reviews')
    .select('phone_id, rating')

  if (error) {
    console.error('Error fetching reviews:', error)
    return {}
  }

  // Hitung rata-rata rating per phone_id
  const ratingsMap: Record<number, { total: number; count: number }> = {}
  
  data?.forEach((review) => {
    if (!ratingsMap[review.phone_id]) {
      ratingsMap[review.phone_id] = { total: 0, count: 0 }
    }
    ratingsMap[review.phone_id].total += review.rating
    ratingsMap[review.phone_id].count += 1
  })

  const averages: Record<number, number> = {}
  Object.keys(ratingsMap).forEach((phoneId) => {
    const id = parseInt(phoneId)
    averages[id] = ratingsMap[id].total / ratingsMap[id].count
  })

  return averages
}

// Halaman Utama
export default async function PhonesPage() {
  // Ambil data dari Supabase
  const phones = await getPhones()
  const brands = await getBrands()
  const averageRatings = await getAverageRatings()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900">
      {/* Header / Navbar */}
      <header className="bg-slate-900/50 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">📱</span>
              <span className="text-xl font-bold text-white">
                CekSpek<span className="text-blue-400">.id</span>
              </span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/phones" className="text-blue-400 font-medium">
                Smartphone
              </Link>
              <Link href="/compare" className="text-slate-300 hover:text-white transition">
                Compare
              </Link>
              <Link href="/brands" className="text-slate-300 hover:text-white transition">
                Brand
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari smartphone..."
                  className="bg-slate-800 text-white px-4 py-2 pl-10 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none w-48 md:w-64"
                />
                <span className="absolute left-3 top-2.5 text-slate-400">
                  🔍
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            📱 Semua Smartphone
          </h1>
          <p className="text-slate-400">
            Menampilkan {phones.length} smartphone dari database
          </p>
        </div>

        {/* Filter Brand */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Filter Brand</h2>
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/phones"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Semua
            </Link>
            {brands.slice(0, 10).map((brand: any) => (
              <Link
                key={brand.id}
                href={`/phones?brand=${brand.slug}`}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm border border-slate-700 hover:border-blue-500 transition"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Phone Grid */}
        {phones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {phones.map((phone: any) => (
              <PhoneCard 
                key={phone.id} 
                phone={phone} 
                averageRating={averageRatings[phone.id] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-semibold text-white mb-2">
              Belum Ada Data Smartphone
            </h3>
            <p className="text-slate-400">
              Data smartphone akan segera ditambahkan
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">{phones.length}</div>
            <div className="text-slate-400 text-sm">Total Smartphone</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">{brands.length}</div>
            <div className="text-slate-400 text-sm">Brand</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {Object.keys(averageRatings).length}
            </div>
            <div className="text-slate-400 text-sm">HP Direview</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">100%</div>
            <div className="text-slate-400 text-sm">Gratis</div>
          </div>
        </div>
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