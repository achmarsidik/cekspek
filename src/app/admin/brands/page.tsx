'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminBrandsPage() {
  const router = useRouter()
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo_url: '',
    country: ''
  })
  const [saving, setSaving] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  // Cek auth & fetch data
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchBrands()
    }
    init()
  }, [router])

  // Fetch brands with phone count
  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        phones ( id )
      `)
      .order('name', { ascending: true })

    if (!error && data) {
      // Count phones per brand
      const brandsWithCount = data.map(brand => ({
        ...brand,
        phone_count: brand.phones?.length || 0
      }))
      setBrands(brandsWithCount)
    }
    setLoading(false)
  }

  // Generate slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' ? { slug: generateSlug(value) } : {})
    }))
  }

  // Open modal for new brand
  const openNewModal = () => {
    setEditingBrand(null)
    setFormData({ name: '', slug: '', logo_url: '', country: '' })
    setShowModal(true)
  }

  // Open modal for edit
  const openEditModal = (brand: any) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      slug: brand.slug,
      logo_url: brand.logo_url || '',
      country: brand.country || ''
    })
    setShowModal(true)
  }

  // Save brand
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const brandData = {
      name: formData.name,
      slug: formData.slug,
      logo_url: formData.logo_url || null,
      country: formData.country || null
    }

    let error

    if (editingBrand) {
      // Update existing
      const result = await supabase
        .from('brands')
        .update(brandData)
        .eq('id', editingBrand.id)
      error = result.error
    } else {
      // Insert new
      const result = await supabase
        .from('brands')
        .insert(brandData)
      error = result.error
    }

    setSaving(false)

    if (error) {
      alert('Gagal menyimpan: ' + error.message)
    } else {
      setShowModal(false)
      await fetchBrands()
    }
  }

  // Delete brand
  const handleDelete = async (id: number, name: string, phoneCount: number) => {
    if (phoneCount > 0) {
      alert(`Tidak bisa menghapus "${name}" karena masih ada ${phoneCount} smartphone terkait.`)
      return
    }

    if (!confirm(`Yakin hapus brand "${name}"?`)) return

    setDeleteLoading(id)
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)

    setDeleteLoading(null)

    if (error) {
      alert('Gagal menghapus: ' + error.message)
    } else {
      setBrands(brands.filter(b => b.id !== id))
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
              <Link href="/admin" className="text-slate-400 hover:text-white transition">
                ← Dashboard
              </Link>
              <span className="text-white font-semibold">🏷️ Kelola Brand</span>
            </div>
            <button
              onClick={openNewModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <span>➕</span> Tambah Brand
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-6 text-slate-400">
          Total {brands.length} brand
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Logo</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Nama Brand</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Slug</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Negara</th>
                  <th className="text-center text-slate-400 text-sm font-medium px-6 py-4">Jumlah HP</th>
                  <th className="text-center text-slate-400 text-sm font-medium px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <tr key={brand.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {brand.logo_url ? (
                            <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-xl">🏷️</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{brand.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-slate-400 text-sm bg-slate-900 px-2 py-1 rounded">
                          {brand.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {brand.country || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-sm ${
                          brand.phone_count > 0 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {brand.phone_count} HP
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(brand)}
                            className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 px-3 py-2 rounded-lg transition"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(brand.id, brand.name, brand.phone_count)}
                            disabled={deleteLoading === brand.id}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-2 rounded-lg transition disabled:opacity-50"
                            title="Hapus"
                          >
                            {deleteLoading === brand.id ? '⏳' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <span className="text-4xl block mb-2">🏷️</span>
                      Belum ada data brand
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingBrand ? '✏️ Edit Brand' : '➕ Tambah Brand Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Nama Brand *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Samsung"
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
                  placeholder="samsung"
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">URL Logo</label>
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Negara Asal</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="South Korea"
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    saving
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {saving ? '⏳ Menyimpan...' : '💾 Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-white transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}