'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Sample JSON template
const sampleJson = `[
  {
    "brand": "Samsung",
    "name": "Galaxy A55 5G",
    "price_min": 5999000,
    "price_max": 6499000,
    "release_date": "2024-03-11",
    "display_size": 6.6,
    "display_type": "Super AMOLED",
    "display_resolution": "1080 x 2340",
    "display_refresh_rate": 120,
    "display_protection": "Corning Gorilla Glass Victus+",
    "chipset": "Exynos 1480",
    "cpu": "Octa-core (4x2.75 GHz & 4x2.0 GHz)",
    "gpu": "Xclipse 530",
    "ram": "8 GB / 12 GB",
    "storage": "128GB / 256GB",
    "antutu_score": 621000,
    "camera_main": "50 MP (wide) + 12 MP (ultrawide) + 5 MP (macro)",
    "camera_front": "32 MP",
    "camera_video": "4K@30fps",
    "battery_capacity": 5000,
    "battery_charging": "25W wired",
    "network": "5G",
    "sim": "Dual Nano-SIM",
    "nfc": true,
    "usb_type": "USB Type-C 2.0",
    "audio_jack": false,
    "body_dimensions": "161.1 x 77.4 x 8.2 mm",
    "body_weight": 213,
    "body_protection": "IP67",
    "fingerprint": "Optical (under display)",
    "face_unlock": true,
    "os": "Android 14",
    "ui": "One UI 6.1",
    "is_featured": false
  }
]`

export default function AdminImportPage() {
  const router = useRouter()
  const [brands, setBrands] = useState<any[]>([])
  const [jsonInput, setJsonInput] = useState('')
  const [parsedData, setParsedData] = useState<any[]>([])
  const [parseError, setParseError] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{success: number, failed: number, errors: string[]} | null>(null)

  // Cek auth & fetch brands
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }

      const { data } = await supabase.from('brands').select('*').order('name')
      if (data) setBrands(data)
    }
    init()
  }, [router])

  // Generate slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Parse JSON
  const handleParse = () => {
    setParseError('')
    setParsedData([])
    setImportResult(null)

    try {
      const data = JSON.parse(jsonInput)
      
      if (!Array.isArray(data)) {
        throw new Error('Data harus berupa array []')
      }

      if (data.length === 0) {
        throw new Error('Array tidak boleh kosong')
      }

      // Validate each item
      const validated = data.map((item, index) => {
        if (!item.name) {
          throw new Error(`Item ${index + 1}: "name" wajib diisi`)
        }
        if (!item.brand) {
          throw new Error(`Item ${index + 1}: "brand" wajib diisi`)
        }
        return item
      })

      setParsedData(validated)
    } catch (err: any) {
      setParseError(err.message || 'JSON tidak valid')
    }
  }

  // Import data
  const handleImport = async () => {
    if (parsedData.length === 0) return

    setImporting(true)
    setImportResult(null)

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const item of parsedData) {
      // Find brand ID
      const brand = brands.find(b => 
        b.name.toLowerCase() === item.brand.toLowerCase()
      )

      if (!brand) {
        failed++
        errors.push(`"${item.name}": Brand "${item.brand}" tidak ditemukan`)
        continue
      }

      // Prepare phone data
      const phoneData = {
        brand_id: brand.id,
        name: item.name,
        slug: generateSlug(item.name),
        image_url: item.image_url || null,
        price_min: item.price_min || null,
        price_max: item.price_max || null,
        release_date: item.release_date || null,
        display_size: item.display_size || null,
        display_type: item.display_type || null,
        display_resolution: item.display_resolution || null,
        display_refresh_rate: item.display_refresh_rate || null,
        display_protection: item.display_protection || null,
        chipset: item.chipset || null,
        cpu: item.cpu || null,
        gpu: item.gpu || null,
        ram: item.ram || null,
        storage: item.storage || null,
        antutu_score: item.antutu_score || null,
        camera_main: item.camera_main || null,
        camera_ultrawide: item.camera_ultrawide || null,
        camera_telephoto: item.camera_telephoto || null,
        camera_front: item.camera_front || null,
        camera_video: item.camera_video || null,
        battery_capacity: item.battery_capacity || null,
        battery_charging: item.battery_charging || null,
        battery_wireless: item.battery_wireless || null,
        network: item.network || null,
        sim: item.sim || null,
        wifi: item.wifi || null,
        bluetooth: item.bluetooth || null,
        nfc: item.nfc ?? false,
        usb_type: item.usb_type || null,
        audio_jack: item.audio_jack ?? false,
        body_dimensions: item.body_dimensions || null,
        body_weight: item.body_weight || null,
        body_material: item.body_material || null,
        body_protection: item.body_protection || null,
        fingerprint: item.fingerprint || null,
        face_unlock: item.face_unlock ?? false,
        os: item.os || null,
        ui: item.ui || null,
        shopee_link: item.shopee_link || null,
        tokopedia_link: item.tokopedia_link || null,
        is_featured: item.is_featured ?? false,
      }

      // Insert to database
      const { error } = await supabase.from('phones').insert(phoneData)

      if (error) {
        failed++
        errors.push(`"${item.name}": ${error.message}`)
      } else {
        success++
      }
    }

    setImporting(false)
    setImportResult({ success, failed, errors })

    if (success > 0) {
      setParsedData([])
      setJsonInput('')
    }
  }

  // Load sample
  const loadSample = () => {
    setJsonInput(sampleJson)
    setParseError('')
    setParsedData([])
    setImportResult(null)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-slate-400 hover:text-white transition">
              ← Dashboard
            </Link>
            <span className="text-white font-semibold">📥 Import Data Smartphone</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
            <span>💡</span> Cara Menggunakan
          </h2>
          <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
            <li>Minta AI (Claude/ChatGPT) untuk generate data HP dalam format JSON</li>
            <li>Copy JSON yang digenerate AI</li>
            <li>Paste di textarea di bawah</li>
            <li>Klik &ldquo;Parse JSON&rdquo; untuk validasi</li>
            <li>Jika valid, klik &ldquo;Import&rdquo; untuk menyimpan ke database</li>
          </ol>
          <div className="mt-4">
            <button
              onClick={loadSample}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              📋 Lihat contoh format JSON
            </button>
          </div>
        </div>

        {/* Prompt Template */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
          <h2 className="text-white font-semibold mb-3">🤖 Contoh Prompt untuk AI</h2>
          <div className="bg-slate-900 rounded-lg p-4 text-sm text-slate-300 font-mono overflow-x-auto">
            <p>Buatkan data spesifikasi smartphone dalam format JSON array untuk:</p>
            <p className="text-blue-400 mt-2">- Samsung Galaxy A35</p>
            <p className="text-blue-400">- Samsung Galaxy A15</p>
            <p className="text-blue-400">- Xiaomi Redmi Note 13 Pro</p>
            <p className="mt-2">Format setiap HP harus memiliki field: brand, name, price_min, display_size, display_type, chipset, ram, storage, camera_main, camera_front, battery_capacity, battery_charging, network, nfc, os, ui, is_featured.</p>
          </div>
        </div>

        {/* JSON Input */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">📝 Paste JSON Data</h2>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste JSON array di sini..."
            className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm min-h-[300px] resize-y"
          />
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleParse}
              disabled={!jsonInput.trim()}
              className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                jsonInput.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              🔍 Parse JSON
            </button>
            <button
              onClick={() => {
                setJsonInput('')
                setParsedData([])
                setParseError('')
                setImportResult(null)
              }}
              className="px-6 py-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-white transition"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Parse Error */}
        {parseError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-400 flex items-center gap-2">
              <span>❌</span> {parseError}
            </p>
          </div>
        )}

        {/* Preview */}
        {parsedData.length > 0 && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
            <h2 className="text-white font-semibold mb-4">
              📋 Preview ({parsedData.length} smartphone)
            </h2>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {parsedData.map((item, index) => (
                <div 
                  key={index}
                  className="bg-slate-900 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{item.name}</p>
                    <p className="text-slate-400 text-sm">
                      {item.brand} • {item.chipset || '-'} • {item.ram || '-'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-blue-400 font-medium">
                      {item.price_min 
                        ? `Rp ${item.price_min.toLocaleString('id-ID')}`
                        : '-'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Import Button */}
            <button
              onClick={handleImport}
              disabled={importing}
              className={`w-full mt-6 py-4 rounded-xl font-medium text-lg transition flex items-center justify-center gap-2 ${
                importing
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {importing ? (
                <>⏳ Mengimport...</>
              ) : (
                <>📥 Import {parsedData.length} Smartphone</>
              )}
            </button>
          </div>
        )}

        {/* Import Result */}
        {importResult && (
          <div className={`rounded-xl p-6 mb-6 ${
            importResult.failed === 0 
              ? 'bg-green-500/20 border border-green-500/50'
              : 'bg-yellow-500/20 border border-yellow-500/50'
          }`}>
            <h3 className={`font-semibold mb-3 ${
              importResult.failed === 0 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {importResult.failed === 0 ? '✅ Import Berhasil!' : '⚠️ Import Selesai dengan Catatan'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{importResult.success}</p>
                <p className="text-slate-400 text-sm">Berhasil</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{importResult.failed}</p>
                <p className="text-slate-400 text-sm">Gagal</p>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-yellow-400 text-sm font-medium mb-2">Errors:</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  {importResult.errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/admin/phones"
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm"
            >
              📱 Lihat daftar smartphone →
            </Link>
          </div>
        )}

        {/* Available Brands */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-white font-semibold mb-4">🏷️ Brand yang Tersedia</h2>
          <p className="text-slate-400 text-sm mb-3">
            Gunakan nama brand berikut di JSON (case-insensitive):
          </p>
          <div className="flex flex-wrap gap-2">
            {brands.map(brand => (
              <span 
                key={brand.id}
                className="bg-slate-700 text-slate-300 px-3 py-1 rounded-lg text-sm"
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}