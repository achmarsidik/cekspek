import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900">
      {/* Header / Navbar */}
      <header className="bg-slate-900/50 border-b border-slate-700">
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

            {/* Search Bar - Link to Search Page */}
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
            sesuai budget kamu. Database lengkap smartphone dari 2020-2025.
          </p>

          {/* Search Box Hero - Link to Search Page */}
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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">850+</div>
              <div className="text-slate-400">Smartphone</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-slate-400">Brand</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-slate-400">Gratis</div>
            </div>
          </div>
        </div>

        {/* Brand Logos */}
        <div className="mt-20">
          <p className="text-center text-slate-400 mb-8">Brand Populer</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Samsung', 'Apple', 'Xiaomi', 'OPPO', 'Vivo', 'Realme', 'OnePlus', 'Google'].map((brand) => (
              <Link 
                key={brand}
                href={`/phones?brand=${brand.toLowerCase()}`}
                className="bg-slate-800 px-6 py-3 rounded-lg border border-slate-700 hover:border-blue-500 transition cursor-pointer"
              >
                <span className="text-white font-medium">{brand}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            🚀 Mulai Sekarang
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Cari HP */}
            <Link href="/search">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition text-center group">
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
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition text-center group">
                <span className="text-4xl mb-4 block">⚖️</span>
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition">
                  Bandingkan HP
                </h3>
                <p className="text-slate-400 text-sm">
                  Bandingkan spesifikasi 2-3 smartphone
                </p>
              </div>
            </Link>

            {/* Lihat Semua */}
            <Link href="/phones">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition text-center group">
                <span className="text-4xl mb-4 block">📱</span>
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition">
                  Semua Smartphone
                </h3>
                <p className="text-slate-400 text-sm">
                  Lihat semua HP di database kami
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