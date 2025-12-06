'use client'

import { useState, useEffect } from 'react'
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

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Search saat user mengetik
  useEffect(() => {
    const searchPhones = async () => {
      if (query.trim().length < 2) {
        setResults([])
        setHasSearched(false)
        return
      }

      setLoading(true)
      setHasSearched(true)

      const { data, error } = await supabase
        .from('phones')
        .select(`
          id, name, slug, image_url, price_min,
          chipset, ram, battery_capacity,
          brands ( name )
        `)
        .or(`name.ilike.%${query}%,chipset.ilike.%${query}%`)
        .order('name', { ascending: true })
        .limit(20)

      if (error) {
        console.error('Search error:', error)
        setResults([])
      } else {
        setResults(data || [])
      }

      setLoading(false)
    }

    const timer = setTimeout(searchPhones, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🔍 Cari Smartphone
          </h1>
          <p className="text-slate-400">
            Ketik nama HP, brand, atau chipset untuk mencari
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: Samsung S24, iPhone 16, Snapdragon..."
              className="w-full bg-slate-800 text-white px-6 py-4 pl-14 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none text-lg"
              autoFocus
            />
            <span className="absolute left-5 top-4 text-2xl">
              🔍
            </span>
            {loading && (
              <span className="absolute right-5 top-4 text-slate-400">
                ⏳
              </span>
            )}
          </div>
          
          {/* Quick Search Tags */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <span className="text-slate-400 text-sm">Populer:</span>
            {['Samsung', 'iPhone', 'Xiaomi', 'Snapdragon', 'Dimensity'].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-blue-400 text-sm hover:underline"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block animate-pulse">🔍</span>
              <p className="text-slate-400">Mencari...</p>
            </div>
          )}

          {/* Results */}
          {!loading && hasSearched && results.length > 0 && (
            <div>
              <p className="text-slate-400 mb-4">
                Ditemukan <span className="text-white font-medium">{results.length}</span> hasil 
                untuk "<span className="text-blue-400">{query}</span>"
              </p>
              
              <div className="space-y-4">
                {results.map((phone: any) => (
                  <Link 
                    key={phone.id} 
                    href={`/phones/${phone.slug}`}
                    className="block"
                  >
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-blue-500 transition flex gap-4 items-center group">
                      {/* Image */}
                      <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        {phone.image_url ? (
                          <img 
                            src={phone.image_url} 
                            alt={phone.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-3xl">📱</span>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-blue-400 text-sm">{phone.brands?.name}</span>
                        </div>
                        <h3 className="text-white font-semibold group-hover:text-blue-400 transition truncate">
                          {phone.name}
                        </h3>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-slate-400">
                          {phone.chipset && (
                            <span>⚡ {phone.chipset}</span>
                          )}
                          {phone.ram && (
                            <span>💾 {phone.ram}</span>
                          )}
                          {phone.battery_capacity && (
                            <span>🔋 {phone.battery_capacity} mAh</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-blue-400 font-bold">
                          {formatPrice(phone.price_min)}
                        </p>
                        <p className="text-slate-500 text-sm group-hover:text-blue-400 transition">
                          Lihat Detail →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && hasSearched && results.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">😕</span>
              <h3 className="text-xl font-semibold text-white mb-2">
                Tidak ada hasil
              </h3>
              <p className="text-slate-400">
                Tidak ditemukan smartphone untuk "<span className="text-blue-400">{query}</span>"
              </p>
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📱</span>
              <h3 className="text-xl font-semibold text-white mb-2">
                Mulai Mencari
              </h3>
              <p className="text-slate-400">
                Ketik minimal 2 karakter untuk mulai mencari
              </p>
            </div>
          )}
        </div>

        {/* Browse All */}
        <div className="text-center mt-12">
          <Link 
            href="/phones"
            className="inline-block bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition"
          >
            📱 Lihat Semua Smartphone
          </Link>
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