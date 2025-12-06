'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ReviewFormProps {
  phoneId: number
  onReviewSubmitted: () => void
}

export default function ReviewForm({ phoneId, onReviewSubmitted }: ReviewFormProps) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi
    if (rating === 0) {
      setError('Pilih rating terlebih dahulu')
      return
    }
    if (comment.trim().length < 10) {
      setError('Komentar minimal 10 karakter')
      return
    }

    setLoading(true)
    setError('')

    // Simpan ke database
    const { error: submitError } = await supabase
      .from('reviews')
      .insert({
        phone_id: phoneId,
        reviewer_name: name.trim() || 'Anonim',
        rating: rating,
        comment: comment.trim()
      })

    setLoading(false)

    if (submitError) {
      setError('Gagal mengirim review. Coba lagi.')
      console.error('Submit error:', submitError)
    } else {
      setSuccess(true)
      setName('')
      setRating(0)
      setComment('')
      onReviewSubmitted()
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        ✍️ Tulis Review
      </h3>

      {success && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-4">
          ✅ Review berhasil dikirim! Terima kasih atas feedback Anda.
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Nama (opsional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda atau kosongkan untuk Anonim"
            className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            maxLength={50}
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Rating <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl transition-transform hover:scale-110"
              >
                {star <= (hoverRating || rating) ? '⭐' : '☆'}
              </button>
            ))}
            <span className="text-slate-400 ml-2 self-center">
              {rating > 0 && (
                <>
                  {rating === 1 && 'Sangat Buruk'}
                  {rating === 2 && 'Buruk'}
                  {rating === 3 && 'Cukup'}
                  {rating === 4 && 'Bagus'}
                  {rating === 5 && 'Sangat Bagus'}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Komentar */}
        <div>
          <label className="block text-slate-400 text-sm mb-2">
            Komentar <span className="text-red-400">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tulis pendapat Anda tentang smartphone ini... (minimal 10 karakter)"
            className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none min-h-[120px] resize-none"
            maxLength={500}
          />
          <p className="text-slate-500 text-sm mt-1 text-right">
            {comment.length}/500 karakter
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            loading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Mengirim...
            </>
          ) : (
            <>
              <span>✅</span>
              Kirim Review
            </>
          )}
        </button>
      </form>
    </div>
  )
}