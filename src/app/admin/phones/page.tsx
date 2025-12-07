'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminPhonesPage() {
  const router = useRouter()
  const [phones, setPhones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  // Cek auth & fetch data
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchPhones()
    }
    init()
  }, [router])

  // Fetch phones
  const fetchPhones = async () => {
    const { data, error } = await supabase
      .from('phones')
      .select(`*, brands ( name )`)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPhones(data)
    }
    setLoading(false)
  }

  // Delete phone
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Yakin hapus "${name}"?`)) return

    setDeleteLoading(id)
    const { error } = await supabase
      .from('phones')
      .delete()
      .eq('id', id)

    setDeleteLoading(null)

    if (error) {
      alert('Gagal menghapus: ' + error.message)
    } else {
      setPhones(phones.filter(p => p.id !== id))
    }
  }

  // Filter phones
  const filteredPhones = phones.filter(phone =>
    phone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    phone.brands?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Format price
  const formatPrice = (price: number | null) => {
    if (!price) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
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
              <span className="text-white font-semibold">📱 Kelola Smartphone</span>
            </div>
            <Link
              href="/admin/phones/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <span>➕</span> Tambah HP Baru
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Cari smartphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-white px-4 py-3 pl-12 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
            <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 text-slate-400">
          Menampilkan {filteredPhones.length} dari {phones.length} smartphone
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Gambar</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Nama</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Brand</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Harga</th>
                  <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Featured</th>
                  <th className="text-center text-slate-400 text-sm font-medium px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPhones.length > 0 ? (
                  filteredPhones.map((phone) => (
                    <tr key={phone.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {phone.image_url ? (
                            <img src={phone.image_url} alt={phone.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-2xl">📱</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{phone.name}</p>
                        <p className="text-slate-400 text-sm">{phone.chipset || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                          {phone.brands?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {formatPrice(phone.price_min)}
                      </td>
                      <td className="px-6 py-4">
                        {phone.is_featured ? (
                          <span className="text-green-400">⭐ Ya</span>
                        ) : (
                          <span className="text-slate-500">Tidak</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/phones/${phone.id}/edit`}
                            className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 px-3 py-2 rounded-lg transition"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(phone.id, phone.name)}
                            disabled={deleteLoading === phone.id}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-2 rounded-lg transition disabled:opacity-50"
                            title="Hapus"
                          >
                            {deleteLoading === phone.id ? '⏳' : '🗑️'}
                          </button>
                          <Link
                            href={`/phones/${phone.slug}`}
                            target="_blank"
                            className="bg-slate-600/50 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded-lg transition"
                            title="Lihat di Website"
                          >
                            👁️
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <span className="text-4xl block mb-2">📭</span>
                      {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada data smartphone'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}