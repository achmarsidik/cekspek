
'use client'

interface AffiliateSectionProps {
  phoneName: string
  priceMin: number | null
  priceMax: number | null
  shopeeLink: string | null
  tokopediaLink: string | null
}

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

export default function AffiliateSection({ 
  phoneName, 
  priceMin, 
  priceMax, 
  shopeeLink, 
  tokopediaLink 
}: AffiliateSectionProps) {
  
  // Jika tidak ada link affiliate, jangan tampilkan
  if (!shopeeLink && !tokopediaLink) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-2xl border border-slate-700 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🛒</span>
        <div>
          <h3 className="text-xl font-bold text-white">Beli Smartphone Ini</h3>
          <p className="text-slate-400 text-sm">Tersedia di marketplace terpercaya</p>
        </div>
      </div>

      {/* Harga */}
      <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
        <p className="text-slate-400 text-sm mb-1">Harga mulai dari</p>
        <p className="text-2xl font-bold text-white">
          {formatPrice(priceMin)}
          {priceMax && priceMax !== priceMin && (
            <span className="text-lg text-slate-400 font-normal"> - {formatPrice(priceMax)}</span>
          )}
        </p>
      </div>

      {/* Affiliate Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Shopee */}
        {shopeeLink && (
          <a
            href={shopeeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/25"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🧡</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Shopee</p>
                  <p className="text-orange-100 text-sm">Gratis Ongkir</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white/80 group-hover:text-white transition">
                  Cek Harga →
                </span>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
          </a>
        )}

        {/* Tokopedia */}
        {tokopediaLink && (
          <a
            href={tokopediaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💚</span>
                </div>
                <div>
                  <p className="font-bold text-lg">Tokopedia</p>
                  <p className="text-green-100 text-sm">Bebas Ongkir</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white/80 group-hover:text-white transition">
                  Cek Harga →
                </span>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
          </a>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-blue-400 font-medium mb-1">Tips Belanja</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Bandingkan harga di kedua marketplace untuk harga terbaik</li>
              <li>• Cek rating dan review toko sebelum membeli</li>
              <li>• Pastikan membeli dari toko resmi/official store</li>
              <li>• Gunakan voucher & promo untuk diskon tambahan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-slate-500 text-xs mt-4 text-center">
        * Harga dapat berubah sewaktu-waktu. Klik link untuk melihat harga terbaru.
      </p>
    </div>
  )
}