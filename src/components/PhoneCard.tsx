import Link from 'next/link'

// Tipe data untuk Phone
interface Phone {
  id: number
  name: string
  slug: string
  image_url: string | null
  price_min: number | null
  price_max: number | null
  display_size: number | null
  chipset: string | null
  ram: string | null
  battery_capacity: number | null
  brands: {
    name: string
    slug: string
  } | null
}

// Props untuk komponen PhoneCard
interface PhoneCardProps {
  phone: Phone
  averageRating?: number
}

// Fungsi untuk format harga ke Rupiah
function formatPrice(price: number | null): string {
  if (!price) return 'Hubungi Toko'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Komponen PhoneCard
export default function PhoneCard({ phone, averageRating = 0 }: PhoneCardProps) {
  return (
    <Link href={`/phones/${phone.slug}`}>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
        {/* Gambar HP */}
        <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
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
          
          {/* Badge Brand */}
          <div className="absolute top-3 left-3 bg-blue-600/90 px-2 py-1 rounded-lg text-xs font-medium text-white">
            {phone.brands?.name}
          </div>
        </div>
        
        {/* Info HP */}
        <div className="p-4">
          {/* Nama HP */}
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition line-clamp-2 min-h-[48px]">
            {phone.name}
          </h3>
          
          {/* Spek Singkat */}
          <div className="mt-2 space-y-1">
            {phone.chipset && (
              <p className="text-slate-400 text-xs flex items-center gap-1">
                <span>⚡</span>
                <span className="line-clamp-1">{phone.chipset}</span>
              </p>
            )}
            <div className="flex gap-3 text-xs text-slate-400">
              {phone.ram && (
                <span className="flex items-center gap-1">
                  <span>💾</span> {phone.ram}
                </span>
              )}
              {phone.battery_capacity && (
                <span className="flex items-center gap-1">
                  <span>🔋</span> {phone.battery_capacity} mAh
                </span>
              )}
            </div>
          </div>
          
          {/* Harga & Rating */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
            <div>
              <span className="text-blue-400 font-bold">
                {formatPrice(phone.price_min)}
              </span>
            </div>
            
            {averageRating > 0 && (
              <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                <span className="text-yellow-400">⭐</span>
                <span className="text-yellow-400 text-sm font-medium">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}