'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ReviewForm from './ReviewForm'

interface Review {
  id: number
  reviewer_name: string
  rating: number
  comment: string
  created_at: string
}

interface ReviewListProps {
  phoneId: number
  initialReviews: Review[]
}

// Fungsi format tanggal
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Hari ini'
  } else if (diffDays === 1) {
    return 'Kemarin'
  } else if (diffDays < 7) {
    return `${diffDays} hari lalu`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} minggu lalu`
  } else {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// Fungsi render bintang
function renderStars(rating: number): string {
  return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
}

export default function ReviewList({ phoneId, initialReviews }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [averageRating, setAverageRating] = useState(0)

  // Hitung rata-rata rating
  useEffect(() => {
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      setAverageRating(avg)
    } else {
      setAverageRating(0)
    }
  }, [reviews])

  // Refresh reviews setelah submit
  const handleReviewSubmitted = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('phone_id', phoneId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setReviews(data)
    }
  }

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          💬 Reviews ({reviews.length})
        </h2>
        {averageRating > 0 && (
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
            <span className="text-yellow-400 text-xl">⭐</span>
            <span className="text-white font-bold text-xl">{averageRating.toFixed(1)}</span>
            <span className="text-slate-400">/ 5</span>
          </div>
        )}
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="grid grid-cols-5 gap-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length
              const percentage = (count / reviews.length) * 100
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm w-8">{star} ⭐</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-yellow-400 h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-slate-400 text-sm w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="space-y-4 mb-8">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">
                      {renderStars(review.rating)}
                    </span>
                    <span className="text-white font-medium">
                      {review.reviewer_name}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">
                    {formatDate(review.created_at)}
                  </p>
                </div>
                <div className="bg-blue-500/20 px-3 py-1 rounded-lg">
                  <span className="text-blue-400 font-medium">{review.rating}/5</span>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center mb-8">
          <span className="text-4xl mb-4 block">💬</span>
          <p className="text-white font-medium">Belum ada review</p>
          <p className="text-slate-400 text-sm mt-1">
            Jadilah yang pertama memberikan review!
          </p>
        </div>
      )}

      {/* Review Form */}
      <ReviewForm phoneId={phoneId} onReviewSubmitted={handleReviewSubmitted} />
    </div>
  )
}