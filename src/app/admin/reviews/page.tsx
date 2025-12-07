'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })

  // Cek auth & fetch data
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      await fetchReviews()
    }
    init()
  }, [router])

  // Fetch reviews
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        phones (
          id,
          name,
          slug,
          brands ( name )
        )
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setReviews(data)
      
      // Calculate stats
      const total = data.length
      const sum = data.reduce((acc, r) => acc + r.rating, 0)
      const average = total > 0 ? sum / total : 0
      
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      data.forEach(r => {
        distribution[r.rating as keyof typeof distribution]++
      })
      
      setStats({ total, average, distribution })
    }
    setLoading(false)
  }

  // Delete review
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus review ini?')) return

    setDeleteLoading(id)
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    setDeleteLoading(null)

    if (error) {
      alert('Gagal menghapus: ' + error.message)
    } else {
      await fetchReviews()
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari lalu`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
    
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Render stars
  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  // Filter reviews
  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews

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
              <span className="text-white font-semibold">⭐ Kelola Review</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Reviews */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Review</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <span className="text-4xl">💬</span>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Rata-rata Rating</p>
                <p className="text-3xl font-bold text-white mt-1">
                  ⭐ {stats.average.toFixed(1)}
                </p>
              </div>
              <span className="text-4xl">📊</span>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-3">Distribusi Rating</p>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-slate-400">{star}⭐</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-yellow-400 h-full rounded-full"
                      style={{ 
                        width: stats.total > 0 
                          ? `${(stats.distribution[star as keyof typeof stats.distribution] / stats.total) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                  <span className="w-6 text-slate-400 text-right">
                    {stats.distribution[star as keyof typeof stats.distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filterRating === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Semua ({stats.total})
          </button>
          {[5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                filterRating === star
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {star}⭐ ({stats.distribution[star as keyof typeof stats.distribution]})
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div 
                key={review.id}
                className="bg-slate-800 rounded-xl border border-slate-700 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-yellow-400">
                        {renderStars(review.rating)}
                      </span>
                      <span className="text-white font-medium">
                        {review.reviewer_name}
                      </span>
                      <span className="text-slate-500 text-sm">
                        • {formatDate(review.created_at)}
                      </span>
                    </div>

                    {/* Phone Info */}
                    {review.phones && (
                      <Link 
                        href={`/phones/${review.phones.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-blue-400 text-sm mb-3 hover:underline"
                      >
                        📱 {review.phones.brands?.name} {review.phones.name}
                        <span className="text-slate-500">→</span>
                      </Link>
                    )}

                    {/* Comment */}
                    <p className="text-slate-300">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deleteLoading === review.id}
                      className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {deleteLoading === review.id ? '⏳' : '🗑️'}
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
              <span className="text-4xl block mb-2">💬</span>
              <p className="text-slate-400">
                {filterRating 
                  ? `Tidak ada review dengan rating ${filterRating} bintang`
                  : 'Belum ada review'
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}