export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900">
      {/* Header / Navbar */}
      <header className="bg-slate-900/50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📱</span>
              <span className="text-xl font-bold text-white">
                CekSpek<span className="text-blue-400">.id</span>
              </span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-slate-300 hover:text-white transition">
                Smartphone
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition">
                Compare
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition">
                Brand
              </a>
            </nav>

            {/* Search Bar */}
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari smartphone..."
                  className="bg-slate-800 text-white px-4 py-2 pl-10 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none w-64"
                />
                <span className="absolute left-3 top-2.5 text-slate-400">
                  🔍
                </span>
              </div>
            </div>
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

          {/* Search Box Hero */}
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Ketik nama HP... (contoh: Samsung Galaxy S24)"
                className="w-full bg-slate-900 text-white px-5 py-4 pl-12 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none text-lg"
              />
              <span className="absolute left-4 top-4 text-2xl">
                🔍
              </span>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-slate-400 text-sm">Populer:</span>
              <a href="#" className="text-blue-400 text-sm hover:underline">iPhone 16 Pro</a>
              <a href="#" className="text-blue-400 text-sm hover:underline">Samsung S24 Ultra</a>
              <a href="#" className="text-blue-400 text-sm hover:underline">Xiaomi 14</a>
            </div>
          </div>

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
              <div 
                key={brand}
                className="bg-slate-800 px-6 py-3 rounded-lg border border-slate-700 hover:border-blue-500 transition cursor-pointer"
              >
                <span className="text-white font-medium">{brand}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Phones Preview */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            📱 Smartphone Terbaru
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone Card 1 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500 transition group">
              <div className="aspect-square bg-slate-700 flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition">
                  Samsung Galaxy S24 Ultra
                </h3>
                <p className="text-slate-400 text-sm mt-1">Snapdragon 8 Gen 3 • 12GB RAM</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-blue-400 font-bold">Rp 19.999.000</span>
                  <span className="text-yellow-400 text-sm">⭐ 4.8</span>
                </div>
              </div>
            </div>

            {/* Phone Card 2 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500 transition group">
              <div className="aspect-square bg-slate-700 flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition">
                  iPhone 16 Pro Max
                </h3>
                <p className="text-slate-400 text-sm mt-1">A18 Pro • 8GB RAM</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-blue-400 font-bold">Rp 22.999.000</span>
                  <span className="text-yellow-400 text-sm">⭐ 4.9</span>
                </div>
              </div>
            </div>

            {/* Phone Card 3 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500 transition group">
              <div className="aspect-square bg-slate-700 flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition">
                  Xiaomi 14 Ultra
                </h3>
                <p className="text-slate-400 text-sm mt-1">Snapdragon 8 Gen 3 • 16GB RAM</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-blue-400 font-bold">Rp 14.999.000</span>
                  <span className="text-yellow-400 text-sm">⭐ 4.7</span>
                </div>
              </div>
            </div>

            {/* Phone Card 4 */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500 transition group">
              <div className="aspect-square bg-slate-700 flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition">
                  Google Pixel 9 Pro
                </h3>
                <p className="text-slate-400 text-sm mt-1">Tensor G4 • 16GB RAM</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-blue-400 font-bold">Rp 16.999.000</span>
                  <span className="text-yellow-400 text-sm">⭐ 4.6</span>
                </div>
              </div>
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition">
              Lihat Semua Smartphone →
            </button>
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