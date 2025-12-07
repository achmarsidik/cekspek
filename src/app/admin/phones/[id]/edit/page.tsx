'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function EditPhonePage() {
  const router = useRouter()
  const params = useParams()
  const phoneId = params.id as string

  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [phoneName, setPhoneName] = useState('')
  const [formData, setFormData] = useState({
    brand_id: '',
    name: '',
    slug: '',
    image_url: '',
    price_min: '',
    price_max: '',
    release_date: '',
    display_size: '',
    display_type: '',
    display_resolution: '',
    display_refresh_rate: '',
    display_protection: '',
    chipset: '',
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    antutu_score: '',
    camera_main: '',
    camera_ultrawide: '',
    camera_telephoto: '',
    camera_front: '',
    camera_video: '',
    battery_capacity: '',
    battery_charging: '',
    battery_wireless: '',
    network: '5G',
    sim: '',
    wifi: '',
    bluetooth: '',
    nfc: true,
    usb_type: '',
    audio_jack: false,
    body_dimensions: '',
    body_weight: '',
    body_material: '',
    body_protection: '',
    fingerprint: '',
    face_unlock: true,
    os: '',
    ui: '',
    shopee_link: '',
    tokopedia_link: '',
    is_featured: false,
  })

  // Fetch phone data & brands
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }

      // Fetch brands
      const { data: brandsData } = await supabase.from('brands').select('*').order('name')
      if (brandsData) setBrands(brandsData)

      // Fetch phone
      const { data: phone, error } = await supabase
        .from('phones')
        .select('*')
        .eq('id', phoneId)
        .single()

      if (error || !phone) {
        alert('HP tidak ditemukan')
        router.push('/admin/phones')
        return
      }

      setPhoneName(phone.name)
      setFormData({
        brand_id: phone.brand_id?.toString() || '',
        name: phone.name || '',
        slug: phone.slug || '',
        image_url: phone.image_url || '',
        price_min: phone.price_min?.toString() || '',
        price_max: phone.price_max?.toString() || '',
        release_date: phone.release_date || '',
        display_size: phone.display_size?.toString() || '',
        display_type: phone.display_type || '',
        display_resolution: phone.display_resolution || '',
        display_refresh_rate: phone.display_refresh_rate?.toString() || '',
        display_protection: phone.display_protection || '',
        chipset: phone.chipset || '',
        cpu: phone.cpu || '',
        gpu: phone.gpu || '',
        ram: phone.ram || '',
        storage: phone.storage || '',
        antutu_score: phone.antutu_score?.toString() || '',
        camera_main: phone.camera_main || '',
        camera_ultrawide: phone.camera_ultrawide || '',
        camera_telephoto: phone.camera_telephoto || '',
        camera_front: phone.camera_front || '',
        camera_video: phone.camera_video || '',
        battery_capacity: phone.battery_capacity?.toString() || '',
        battery_charging: phone.battery_charging || '',
        battery_wireless: phone.battery_wireless || '',
        network: phone.network || '5G',
        sim: phone.sim || '',
        wifi: phone.wifi || '',
        bluetooth: phone.bluetooth || '',
        nfc: phone.nfc ?? true,
        usb_type: phone.usb_type || '',
        audio_jack: phone.audio_jack ?? false,
        body_dimensions: phone.body_dimensions || '',
        body_weight: phone.body_weight?.toString() || '',
        body_material: phone.body_material || '',
        body_protection: phone.body_protection || '',
        fingerprint: phone.fingerprint || '',
        face_unlock: phone.face_unlock ?? true,
        os: phone.os || '',
        ui: phone.ui || '',
        shopee_link: phone.shopee_link || '',
        tokopedia_link: phone.tokopedia_link || '',
        is_featured: phone.is_featured ?? false,
      })

      setLoading(false)
    }
    init()
  }, [phoneId, router])

  // Generate slug
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' ? { slug: generateSlug(value) } : {})
    }))
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const phoneData = {
      brand_id: parseInt(formData.brand_id),
      name: formData.name,
      slug: formData.slug,
      image_url: formData.image_url || null,
      price_min: formData.price_min ? parseInt(formData.price_min) : null,
      price_max: formData.price_max ? parseInt(formData.price_max) : null,
      release_date: formData.release_date || null,
      display_size: formData.display_size ? parseFloat(formData.display_size) : null,
      display_type: formData.display_type || null,
      display_resolution: formData.display_resolution || null,
      display_refresh_rate: formData.display_refresh_rate ? parseInt(formData.display_refresh_rate) : null,
      display_protection: formData.display_protection || null,
      chipset: formData.chipset || null,
      cpu: formData.cpu || null,
      gpu: formData.gpu || null,
      ram: formData.ram || null,
      storage: formData.storage || null,
      antutu_score: formData.antutu_score ? parseInt(formData.antutu_score) : null,
      camera_main: formData.camera_main || null,
      camera_ultrawide: formData.camera_ultrawide || null,
      camera_telephoto: formData.camera_telephoto || null,
      camera_front: formData.camera_front || null,
      camera_video: formData.camera_video || null,
      battery_capacity: formData.battery_capacity ? parseInt(formData.battery_capacity) : null,
      battery_charging: formData.battery_charging || null,
      battery_wireless: formData.battery_wireless || null,
      network: formData.network || null,
      sim: formData.sim || null,
      wifi: formData.wifi || null,
      bluetooth: formData.bluetooth || null,
      nfc: formData.nfc,
      usb_type: formData.usb_type || null,
      audio_jack: formData.audio_jack,
      body_dimensions: formData.body_dimensions || null,
      body_weight: formData.body_weight ? parseInt(formData.body_weight) : null,
      body_material: formData.body_material || null,
      body_protection: formData.body_protection || null,
      fingerprint: formData.fingerprint || null,
      face_unlock: formData.face_unlock,
      os: formData.os || null,
      ui: formData.ui || null,
      shopee_link: formData.shopee_link || null,
      tokopedia_link: formData.tokopedia_link || null,
      is_featured: formData.is_featured,
    }

    const { error } = await supabase
      .from('phones')
      .update(phoneData)
      .eq('id', phoneId)

    setSaving(false)

    if (error) {
      alert('Gagal menyimpan: ' + error.message)
    } else {
      alert('Perubahan berhasil disimpan!')
      router.push('/admin/phones')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-pulse">⏳</span>
          <p className="text-white mt-4">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/phones" className="text-slate-400 hover:text-white transition">
                ← Kembali
              </Link>
              <span className="text-white font-semibold">✏️ Edit: {phoneName}</span>
            </div>
            <Link
              href={`/phones/${formData.slug}`}
              target="_blank"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              👁️ Lihat di Website →
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📋 Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Brand *</label>
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Pilih Brand --</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Nama HP *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Slug (URL)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Tanggal Rilis</label>
                <input
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleChange}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Harga Minimum (Rp)</label>
                <input
                  type="number"
                  name="price_min"
                  value={formData.price_min}
                  onChange={handleChange}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Harga Maximum (Rp)</label>
                <input
                  type="number"
                  name="price_max"
                  value={formData.price_max}
                  onChange={handleChange}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-white">⭐ Tampilkan di Homepage (Featured)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🖼️ Gambar HP</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview */}
              <div className="bg-slate-900 rounded-xl p-6 flex items-center justify-center min-h-[200px]">
                {formData.image_url ? (
                  <img 
                    src={formData.image_url} 
                    alt="Preview"
                    className="max-h-48 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="text-center text-slate-500">
                    <span className="text-6xl block mb-2">📱</span>
                    <p>Belum ada gambar</p>
                  </div>
                )}
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">URL Gambar</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/gambar-hp.png"
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
                
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 text-sm font-medium mb-2">💡 Cara Mendapatkan URL Gambar:</p>
                  <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
                    <li>Cari gambar HP di Google Images</li>
                    <li>Klik kanan pada gambar → &quot;Copy image address&quot;</li>
                    <li>Paste URL di kolom di atas</li>
                  </ol>
                  <p className="text-slate-400 text-xs mt-2">
                    Atau gunakan gambar dari: GSMArena, official website brand, dll.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Display */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📺 Layar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Ukuran (inch)</label>
                <input type="text" name="display_size" value={formData.display_size} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Tipe Panel</label>
                <input type="text" name="display_type" value={formData.display_type} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Resolusi</label>
                <input type="text" name="display_resolution" value={formData.display_resolution} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Refresh Rate (Hz)</label>
                <input type="number" name="display_refresh_rate" value={formData.display_refresh_rate} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-2">Proteksi</label>
                <input type="text" name="display_protection" value={formData.display_protection} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">⚡ Performa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Chipset</label>
                <input type="text" name="chipset" value={formData.chipset} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">CPU</label>
                <input type="text" name="cpu" value={formData.cpu} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">GPU</label>
                <input type="text" name="gpu" value={formData.gpu} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Antutu Score</label>
                <input type="number" name="antutu_score" value={formData.antutu_score} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">RAM</label>
                <input type="text" name="ram" value={formData.ram} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Storage</label>
                <input type="text" name="storage" value={formData.storage} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Camera */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📸 Kamera</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-2">Kamera Utama</label>
                <input type="text" name="camera_main" value={formData.camera_main} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Ultrawide</label>
                <input type="text" name="camera_ultrawide" value={formData.camera_ultrawide} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Telephoto</label>
                <input type="text" name="camera_telephoto" value={formData.camera_telephoto} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Kamera Depan</label>
                <input type="text" name="camera_front" value={formData.camera_front} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Video</label>
                <input type="text" name="camera_video" value={formData.camera_video} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Battery */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🔋 Baterai</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Kapasitas (mAh)</label>
                <input type="number" name="battery_capacity" value={formData.battery_capacity} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Fast Charging</label>
                <input type="text" name="battery_charging" value={formData.battery_charging} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Wireless Charging</label>
                <input type="text" name="battery_wireless" value={formData.battery_wireless} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Connectivity */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📡 Konektivitas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Jaringan</label>
                <select name="network" value={formData.network} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none">
                  <option value="5G">5G</option>
                  <option value="4G">4G LTE</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">SIM</label>
                <input type="text" name="sim" value={formData.sim} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">USB</label>
                <input type="text" name="usb_type" value={formData.usb_type} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">WiFi</label>
                <input type="text" name="wifi" value={formData.wifi} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Bluetooth</label>
                <input type="text" name="bluetooth" value={formData.bluetooth} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="nfc" checked={formData.nfc} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-white">NFC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="audio_jack" checked={formData.audio_jack} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-white">Audio Jack</span>
                </label>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📐 Body</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Dimensi</label>
                <input type="text" name="body_dimensions" value={formData.body_dimensions} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Berat (gram)</label>
                <input type="number" name="body_weight" value={formData.body_weight} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Material</label>
                <input type="text" name="body_material" value={formData.body_material} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Ketahanan (IP Rating)</label>
                <input type="text" name="body_protection" value={formData.body_protection} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Security & Software */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🔐 Keamanan & Software</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Fingerprint</label>
                <input type="text" name="fingerprint" value={formData.fingerprint} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="face_unlock" checked={formData.face_unlock} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-white">Face Unlock</span>
                </label>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">OS</label>
                <input type="text" name="os" value={formData.os} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">UI</label>
                <input type="text" name="ui" value={formData.ui} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Affiliate Links */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🛒 Link Affiliate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Link Shopee</label>
                <input type="url" name="shopee_link" value={formData.shopee_link} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Link Tokopedia</label>
                <input type="url" name="tokopedia_link" value={formData.tokopedia_link} onChange={handleChange} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 py-4 rounded-xl font-medium text-lg transition flex items-center justify-center gap-2 ${
                saving
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {saving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
            <Link
              href="/admin/phones"
              className="px-8 py-4 rounded-xl font-medium text-lg bg-slate-700 hover:bg-slate-600 text-white transition text-center"
            >
              Batal
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}