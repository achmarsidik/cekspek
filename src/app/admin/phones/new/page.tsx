'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AddPhonePage() {
  const router = useRouter()
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    brand_id: '',
    name: '',
    slug: '',
    image_url: '',
    price_min: '',
    price_max: '',
    release_date: '',
    // Display
    display_size: '',
    display_type: '',
    display_resolution: '',
    display_refresh_rate: '',
    display_protection: '',
    // Performance
    chipset: '',
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    antutu_score: '',
    // Camera
    camera_main: '',
    camera_ultrawide: '',
    camera_telephoto: '',
    camera_front: '',
    camera_video: '',
    // Battery
    battery_capacity: '',
    battery_charging: '',
    battery_wireless: '',
    // Connectivity
    network: '5G',
    sim: '',
    wifi: '',
    bluetooth: '',
    nfc: true,
    usb_type: '',
    audio_jack: false,
    // Body
    body_dimensions: '',
    body_weight: '',
    body_material: '',
    body_protection: '',
    // Security
    fingerprint: '',
    face_unlock: true,
    // Software
    os: '',
    ui: '',
    // Affiliate
    shopee_link: '',
    tokopedia_link: '',
    // Meta
    is_featured: false,
  })

  // Fetch brands
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

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
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
    setLoading(true)

    // Prepare data
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

    const { error } = await supabase.from('phones').insert(phoneData)

    setLoading(false)

    if (error) {
      alert('Gagal menyimpan: ' + error.message)
    } else {
      alert('Smartphone berhasil ditambahkan!')
      router.push('/admin/phones')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin/phones" className="text-slate-400 hover:text-white transition">
              ← Kembali
            </Link>
            <span className="text-white font-semibold">➕ Tambah Smartphone Baru</span>
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
                  placeholder="Samsung Galaxy S24 Ultra"
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
                  placeholder="samsung-galaxy-s24-ultra"
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">URL Gambar</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Harga Minimum</label>
                <input
                  type="number"
                  name="price_min"
                  value={formData.price_min}
                  onChange={handleChange}
                  placeholder="19999000"
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Harga Maximum</label>
                <input
                  type="number"
                  name="price_max"
                  value={formData.price_max}
                  onChange={handleChange}
                  placeholder="24999000"
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
              <div className="flex items-center">
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

          {/* Display */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📺 Layar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Ukuran (inch)</label>
                <input type="text" name="display_size" value={formData.display_size} onChange={handleChange} placeholder="6.8" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Tipe Panel</label>
                <input type="text" name="display_type" value={formData.display_type} onChange={handleChange} placeholder="Dynamic AMOLED 2X" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Resolusi</label>
                <input type="text" name="display_resolution" value={formData.display_resolution} onChange={handleChange} placeholder="1440 x 3120" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Refresh Rate (Hz)</label>
                <input type="number" name="display_refresh_rate" value={formData.display_refresh_rate} onChange={handleChange} placeholder="120" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-2">Proteksi</label>
                <input type="text" name="display_protection" value={formData.display_protection} onChange={handleChange} placeholder="Corning Gorilla Glass Victus 2" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">⚡ Performa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Chipset</label>
                <input type="text" name="chipset" value={formData.chipset} onChange={handleChange} placeholder="Snapdragon 8 Gen 3" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">CPU</label>
                <input type="text" name="cpu" value={formData.cpu} onChange={handleChange} placeholder="Octa-core" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">GPU</label>
                <input type="text" name="gpu" value={formData.gpu} onChange={handleChange} placeholder="Adreno 750" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">RAM</label>
                <input type="text" name="ram" value={formData.ram} onChange={handleChange} placeholder="12 GB" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Storage</label>
                <input type="text" name="storage" value={formData.storage} onChange={handleChange} placeholder="256GB / 512GB / 1TB" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Antutu Score</label>
                <input type="number" name="antutu_score" value={formData.antutu_score} onChange={handleChange} placeholder="2200000" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Camera */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📸 Kamera</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-2">Kamera Utama</label>
                <input type="text" name="camera_main" value={formData.camera_main} onChange={handleChange} placeholder="200 MP (wide) + 12 MP (ultrawide)..." className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Ultrawide</label>
                <input type="text" name="camera_ultrawide" value={formData.camera_ultrawide} onChange={handleChange} placeholder="12 MP" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Telephoto</label>
                <input type="text" name="camera_telephoto" value={formData.camera_telephoto} onChange={handleChange} placeholder="50 MP (5x optical)" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Kamera Depan</label>
                <input type="text" name="camera_front" value={formData.camera_front} onChange={handleChange} placeholder="12 MP" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Video</label>
                <input type="text" name="camera_video" value={formData.camera_video} onChange={handleChange} placeholder="8K@30fps, 4K@60fps" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Battery */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🔋 Baterai</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Kapasitas (mAh)</label>
                <input type="number" name="battery_capacity" value={formData.battery_capacity} onChange={handleChange} placeholder="5000" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Fast Charging</label>
                <input type="text" name="battery_charging" value={formData.battery_charging} onChange={handleChange} placeholder="45W wired" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Wireless Charging</label>
                <input type="text" name="battery_wireless" value={formData.battery_wireless} onChange={handleChange} placeholder="15W wireless" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
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
                  <option value="3G">3G</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">SIM</label>
                <input type="text" name="sim" value={formData.sim} onChange={handleChange} placeholder="Dual Nano-SIM + eSIM" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">USB</label>
                <input type="text" name="usb_type" value={formData.usb_type} onChange={handleChange} placeholder="USB Type-C 3.2" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">WiFi</label>
                <input type="text" name="wifi" value={formData.wifi} onChange={handleChange} placeholder="Wi-Fi 7" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Bluetooth</label>
                <input type="text" name="bluetooth" value={formData.bluetooth} onChange={handleChange} placeholder="5.3" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="nfc" checked={formData.nfc} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-white">NFC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="audio_jack" checked={formData.audio_jack} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-white">Audio Jack 3.5mm</span>
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
                <input type="text" name="body_dimensions" value={formData.body_dimensions} onChange={handleChange} placeholder="162.3 x 79 x 8.6 mm" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Berat (gram)</label>
                <input type="number" name="body_weight" value={formData.body_weight} onChange={handleChange} placeholder="232" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Material</label>
                <input type="text" name="body_material" value={formData.body_material} onChange={handleChange} placeholder="Titanium frame, Glass back" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Ketahanan</label>
                <input type="text" name="body_protection" value={formData.body_protection} onChange={handleChange} placeholder="IP68" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Security & Software */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🔐 Keamanan & Software</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Fingerprint</label>
                <input type="text" name="fingerprint" value={formData.fingerprint} onChange={handleChange} placeholder="Ultrasonic (under display)" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="face_unlock" checked={formData.face_unlock} onChange={handleChange} className="w-5 h-5" />
                  <span className="text-white">Face Unlock</span>
                </label>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">OS</label>
                <input type="text" name="os" value={formData.os} onChange={handleChange} placeholder="Android 14" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">UI</label>
                <input type="text" name="ui" value={formData.ui} onChange={handleChange} placeholder="One UI 6.1" className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Affiliate Links */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🛒 Link Affiliate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Link Shopee</label>
                <input type="url" name="shopee_link" value={formData.shopee_link} onChange={handleChange} placeholder="https://shopee.co.id/..." className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Link Tokopedia</label>
                <input type="url" name="tokopedia_link" value={formData.tokopedia_link} onChange={handleChange} placeholder="https://tokopedia.com/..." className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-4 rounded-xl font-medium text-lg transition flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? (
                <>⏳ Menyimpan...</>
              ) : (
                <>💾 Simpan Smartphone</>
              )}
            </button>
            <Link
              href="/admin/phones"
              className="px-8 py-4 rounded-xl font-medium text-lg bg-slate-700 hover:bg-slate-600 text-white transition"
            >
              Batal
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}