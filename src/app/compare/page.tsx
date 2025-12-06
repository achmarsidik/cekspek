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

// Fungsi format angka (untuk Antutu)
function formatNumber(num: number | null): string {
  if (!num) return '-'
  return new Intl.NumberFormat('id-ID').format(num)
}

// Komponen untuk row spesifikasi (SIMPLE - tanpa highlight)
function SpecRow({ 
  label, 
  values, 
  suffix = ''
}: { 
  label: string
  values: (string | number | boolean | null)[]
  suffix?: string
}) {
  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-800/30 transition">
      <td className="py-3 px-4 text-slate-400 font-medium">{label}</td>
      {values.map((value, index) => {
        let displayValue = '-'
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'boolean') {
            displayValue = value ? '✅ Ya' : '❌ Tidak'
          } else {
            displayValue = `${value}${suffix}`
          }
        }

        return (
          <td key={index} className="py-3 px-4 text-center text-white">
            {displayValue}
          </td>
        )
      })}
    </tr>
  )
}

// Halaman Compare
export default function ComparePage() {
  const [phones, setPhones] = useState<any[]>([])
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [selectedIds, setSelectedIds] = useState<(number | null)[]>([null, null])
  const [showComparison, setShowComparison] = useState(false)
  const [loading, setLoading] = useState(true)

  // Ambil data saat halaman dimuat
  useEffect(() => {
    async function fetchData() {
      // Ambil phones
      const { data: phonesData } = await supabase
        .from('phones')
        .select(`
          id, name, slug, image_url, price_min,
          display_size, display_type, display_resolution, display_refresh_rate, display_protection,
          chipset, cpu, gpu, ram, storage, antutu_score,
          camera_main, camera_ultrawide, camera_telephoto, camera_front, camera_video,
          battery_capacity, battery_charging, battery_wireless,
          network, sim, wifi, bluetooth, nfc, usb_type, audio_jack,
          body_dimensions, body_weight, body_material, body_protection,
          fingerprint, face_unlock, os, ui,
          brands ( name )
        `)
        .order('name', { ascending: true })

      setPhones(phonesData ?? [])

      // Ambil ratings
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('phone_id, rating')

      const ratingsMap: Record<number, { total: number; count: number }> = {}
      reviewsData?.forEach((review) => {
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
      setRatings(averages)

      setLoading(false)
    }

    fetchData()
  }, [])

  // Tambah slot HP
  const addSlot = () => {
    if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, null])
    }
  }

  // Hapus slot HP
  const removeSlot = (index: number) => {
    if (selectedIds.length > 2) {
      const newIds = selectedIds.filter((_, i) => i !== index)
      setSelectedIds(newIds)
      setShowComparison(false)
    }
  }

  // Update pilihan HP
  const updateSelection = (index: number, phoneId: number | null) => {
    const newIds = [...selectedIds]
    newIds[index] = phoneId
    setSelectedIds(newIds)
    setShowComparison(false)
  }

  // Ambil data HP yang dipilih
  const selectedPhones = selectedIds
    .map(id => phones.find((p: any) => p.id === id))
    .filter((p): p is any => p !== undefined)

  // Cek apakah bisa compare
  const canCompare = selectedPhones.length >= 2

  // Handle compare
  const handleCompare = () => {
    if (canCompare) {
      setShowComparison(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-white text-xl">Memuat data...</p>
        </div>
      </div>
    )
  }

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
              <Link href="/compare" className="text-blue-400 font-medium">
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
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            ⚖️ Bandingkan Smartphone
          </h1>
          <p className="text-slate-400">
            Pilih 2-3 smartphone untuk melihat perbandingan spesifikasi
          </p>
        </div>

        {/* Phone Selection */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Pilih Smartphone untuk Dibandingkan
          </h2>

          <div className="flex flex-wrap gap-4 items-end">
            {selectedIds.map((selectedId, index) => (
              <div key={index} className="flex-1 min-w-[200px] max-w-[300px]">
                <label className="text-slate-400 text-sm mb-2 block">
                  Smartphone {index + 1}
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedId || ''}
                    onChange={(e) => updateSelection(index, e.target.value ? parseInt(e.target.value) : null)}
                    className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Pilih HP --</option>
                    {phones.map((phone: any) => (
                      <option 
                        key={phone.id} 
                        value={phone.id}
                        disabled={selectedIds.includes(phone.id) && selectedId !== phone.id}
                      >
                        {phone.brands?.name} {phone.name}
                      </option>
                    ))}
                  </select>
                  
                  {selectedIds.length > 2 && (
                    <button
                      onClick={() => removeSlot(index)}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 rounded-lg transition"
                      title="Hapus"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            {selectedIds.length < 3 && (
              <button
                onClick={addSlot}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition flex items-center gap-2"
              >
                <span>+</span> Tambah HP
              </button>
            )}
          </div>

          {/* Compare Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCompare}
              disabled={!canCompare}
              className={`px-8 py-3 rounded-xl font-medium text-lg transition flex items-center gap-2 ${
                canCompare
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>⚖️</span>
              Bandingkan {selectedPhones.length} Smartphone
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        {showComparison && selectedPhones.length >= 2 && (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            {/* Header dengan gambar HP */}
            <div className="grid gap-4 p-6 border-b border-slate-700" 
                 style={{ gridTemplateColumns: `180px repeat(${selectedPhones.length}, 1fr)` }}>
              <div></div>
              {selectedPhones.map((phone: any) => (
                <div key={phone.id} className="text-center">
                  <div className="bg-slate-700/50 rounded-xl p-4 mb-4 aspect-square flex items-center justify-center max-w-[150px] mx-auto">
                    {phone.image_url ? (
                      <img 
                        src={phone.image_url} 
                        alt={phone.name}
                        className="max-h-28 object-contain"
                      />
                    ) : (
                      <span className="text-5xl">📱</span>
                    )}
                  </div>
                  <p className="text-blue-400 text-sm font-medium">{phone.brands?.name}</p>
                  <h3 className="text-white font-bold mt-1 text-sm">{phone.name}</h3>
                  <Link 
                    href={`/phones/${phone.slug}`}
                    className="text-slate-400 text-xs hover:text-blue-400 transition"
                  >
                    Lihat Detail →
                  </Link>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {/* Harga & Rating */}
                  <tr className="bg-blue-900/30">
                    <td colSpan={selectedPhones.length + 1} className="py-3 px-4 text-blue-400 font-semibold">
                      💰 Harga & Rating
                    </td>
                  </tr>
                  <SpecRow 
                    label="Harga" 
                    values={selectedPhones.map((p: any) => formatPrice(p.price_min))}
                  />
                  <SpecRow 
                    label="Rating" 
                    values={selectedPhones.map((p: any) => ratings[p.id] ? `⭐ ${ratings[p.id].toFixed(1)}` : '-')}
                  />

                  {/* Performa & Benchmark */}
                  <tr className="bg-blue-900/30">
                    <td colSpan={selectedPhones.length + 1} className="py-3 px-4 text-blue-400 font-semibold">
                      ⚡ Performa & Benchmark
                    </td>
                  </tr>
                  <SpecRow 
                    label="Chipset" 
                    values={selectedPhones.map((p: any) => p.chipset)}
                  />
                  <SpecRow 
                    label="CPU" 
                    values={selectedPhones.map((p: any) => p.cpu)}
                  />
                  <SpecRow 
                    label="GPU" 
                    values={selectedPhones.map((p: any) => p.gpu)}
                  />
                  <SpecRow 
                    label="RAM" 
                    values={selectedPhones.map((p: any) => p.ram)}
                  />
                  <SpecRow 
                    label="Storage" 
                    values={selectedPhones.map((p: any) => p.storage)}
                  />
                  <SpecRow 
                    label="Antutu Benchmark" 
                    values={selectedPhones.map((p: any) => formatNumber(p.antutu_score))}
                  />

                  {/* Layar */}
                  <tr className="bg-blue-900/30">
                    <td colSpan={selectedPhones.length + 1} className="py-3 px-4 text-blue-400 font-semibold">
                      📺 Layar
                    </td>
                  </tr>
                  <SpecRow 
                    label="Ukuran" 
                    values={selectedPhones.map((p: any) => p.display_size)}
                    suffix={' inch'}
                  />
                  <SpecRow 
                    label="Tipe Panel" 
                    values={selectedPhones.map((p: any) => p.display_type)}
                  />
                  <SpecRow 
                    label="Resolusi" 
                    values={selectedPhones.map((p: any) => p.display_resolution)}
                  />
                  <SpecRow 
                    label="Refresh Rate" 
                    values={selectedPhones.map((p: any) => p.display_refresh_rate)}
                    suffix={' Hz'}
                  />
                  <SpecRow 
                    label="Proteksi" 
                    values={selectedPhones.map((p: any) => p.display_protection)}
                  />

                  {/* Kamera Belakang */}
                  <tr className="bg-blue-900/30">
                    <td colSpan={selectedPhones.length + 1} className="py-3 px-4 text-blue-400 font-semibold">
                      📸 Kamera Belakang
                    </td>
                  </tr>
                  <SpecRow 
                    label="Kamera Utama" 
                    values={selectedPhones.map((p: any) => p.camera_main)}
                  />
                  <SpecRow 
                    label="Ultrawide" 
                    values={selectedPhones.map((p: any) => p.camera_ultrawide)}
                  />
                  <SpecRow 
                    label="Telephoto" 
                    values={selectedPhones.map((p: any) => p.camera_telephoto)}
                  />
                  <SpecRow 
                    label="Video" 
                    values={selectedPhones.map((p: any) => p.camera_video)}
                  />

                  {/* Kamera Depan */}
                  <tr className="bg-blue-900/30">
                    <td colSpan={selectedPhones.length + 1} className="py-3 px-4 text-blue-400 font-semibold">
                      🤳 Kamera Depan
                    </td>
                  </tr>
                  <SpecRow 
                    label="Kamera Depan" 
                    values={selectedPhones.map((p: any) => p.camera_front)}
                  />

                  {/* Baterai */}
                  <tr className="bg-blue-900/30">
                    <td colSpan={selectedPhones.length + 1} className="py-3 px-4 text-blue-400 font-semibold">
                      🔋 Baterai
                    </td>
                  </tr>
                  <SpecRow 
                    label="Kapasitas" 
                    values={selectedPhones.map((p: any) => p.battery_capacity)}
                    suffix={' mAh'}
                  />
                  <SpecRow 
                    label="Pengisian Daya" 
                    values={selectedPhones.map((p: any) => p.battery_charging)}
                  />
                  <SpecRow 
                    label="Wireless Charging" 
                    values={selectedPhones.map((p: any) => p.battery_wireless)}
                  />

                  {/* Konektivitas */}
                  <tr className="bg-blue-900/30">
                    <td colSpan={selectedPhones.length + 1} className="py-3 px-4 text-blue-400 font-semibold">
                      📡 Konektivitas
                    </td>
                  </tr>
                  <SpecRow 
                    label="Jaringan" 
                    values={selectedPhones.map((p: any) => p.network)}
                  />
                  <SpecRow 
                    label="SIM" 
                    values={selectedPhones.map((p: any) => p.sim)}
                  />
                  <SpecRow 
                    label="WiFi" 
                    values={selectedPhones.map((p: any) => p.wifi)}
                  />
                  <SpecRow 
                    label="Bluetooth" 
                    values={selectedPhones.map((p: any) => p.bluetooth)}
                  />
                  <SpecRow 
                    label="NFC" 
                    values={selectedPhones.map((p: any) => p.nfc)}
                  />
                  <SpecRow 
                    label="USB" 
                    values={selectedPhones.map((p: any) => p.usb_type)}
                  />
                  <SpecRow 
                    label="Audio Jack 3.5mm" 
                    values={selectedPhones.map((p: any) => p.audio_jack)}
                  />

                  {/* Body */}
                  <tr className="bg-blue-900/30">
                    <td colSpan={selectedPhones.length + 1} className="py-3 px-4 text-blue-400 font-semibold">
                      📐 Desain & Body
                    </td>
                  </tr>
                  <SpecRow 
                    label="Dimensi" 
                    values={selectedPhones.map((p: any) => p.body_dimensions)}
                  />
                  <SpecRow 
                    label="Berat" 
                    values={selectedPhones.map((p: any) => p.body_weight)}
                    suffix={' gram'}
                  />
                  <SpecRow 
                    label="Material" 
                    values={selectedPhones.map((p: any) => p.body_material)}
                  />
                  <SpecRow 
                    label="Ketahanan" 
                    values={selectedPhones.map((p: any) => p.body_protection)}
                  />

                  {/* Keamanan & Software */}
                  <tr className="bg-blue-900/30">
                    <td colSpan={selectedPhones.length + 1} className="py-3 px-4 text-blue-400 font-semibold">
                      🔐 Keamanan & Software
                    </td>
                  </tr>
                  <SpecRow 
                    label="Fingerprint" 
                    values={selectedPhones.map((p: any) => p.fingerprint)}
                  />
                  <SpecRow 
                    label="Face Unlock" 
                    values={selectedPhones.map((p: any) => p.face_unlock)}
                  />
                  <SpecRow 
                    label="OS" 
                    values={selectedPhones.map((p: any) => p.os)}
                  />
                  <SpecRow 
                    label="UI" 
                    values={selectedPhones.map((p: any) => p.ui)}
                  />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showComparison && (
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
            <span className="text-6xl mb-4 block">⚖️</span>
            <h3 className="text-xl font-semibold text-white mb-2">
              Pilih Smartphone untuk Dibandingkan
            </h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Pilih minimal 2 smartphone dari dropdown di atas, lalu klik tombol 
              Bandingkan untuk melihat perbandingan spesifikasi lengkap.
            </p>
          </div>
        )}

        {/* Popular Comparisons */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">
            🔥 Perbandingan Populer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { phone1: 'Samsung Galaxy S24 Ultra', phone2: 'iPhone 16 Pro Max' },
              { phone1: 'Xiaomi 14 Ultra', phone2: 'Samsung Galaxy S24 Ultra' },
              { phone1: 'Google Pixel 9 Pro', phone2: 'iPhone 16 Pro Max' },
            ].map((comparison, index) => (
              <div 
                key={index}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 hover:border-blue-500 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{comparison.phone1}</p>
                  </div>
                  <div className="px-3 text-slate-500">VS</div>
                  <div className="flex-1 text-right">
                    <p className="text-white font-medium text-sm">{comparison.phone2}</p>
                  </div>
                </div>
              </div>
            ))}
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