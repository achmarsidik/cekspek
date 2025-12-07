'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    phones: 0,
    brands: 0,
    reviews: 0
  })

  // Cek auth status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/admin/login')
        return
      }
      
      setUser(session.user)
      
      // Fetch stats
      const { count: phonesCount } = await supabase
        .from('phones')
        .select('*', { count: 'exact', head: true })
      
      const { count: brandsCount } = await supabase
        .from('brands')
        .select('*', { count: 'exact', head: true })
      
      const { count: reviewsCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
      
      setStats({
        phones: phonesCount || 0,
        brands: brandsCount || 0,
        reviews: reviewsCount || 0
      })
      
      setLoading(false)
    }
    
    checkUser()
  }, [router])

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-pulse">⏳</span>
          <p className="text-white mt-4">Memuat...</p>
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
              <Link href="/admin" className="flex items-center space-x-2">
                <span className="text-2xl">📱</span>
                <span className="text-xl font-bold text-white">
                  CekSpek<span className="text-blue-400">.id</span>
                </span>
              </Link>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Admin
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm hidden md:block">
                {user?.email}
              </span>
              <Link 
                href="/"
                target="_blank"
                className="text-slate-400 hover:text-white transition text-sm"
              >
                🌐 Lihat Website
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded-lg text-sm transition"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            👋 Selamat Datang, Admin!
          </h1>
          <p className="text-slate-400">
            Kelola website CekSpek.id dari dashboard ini
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Smartphone</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.phones}</p>
              </div>
              <span className="text-4xl">📱</span>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Brand</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.brands}</p>
              </div>
              <span className="text-4xl">🏷️</span>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Reviews</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.reviews}</p>
              </div>
              <span className="text-4xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-white mb-4">⚡ Menu Admin</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kelola HP */}
          <Link href="/admin/phones">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition group cursor-pointer">
              <span className="text-4xl mb-4 block">📱</span>
              <h3 className="text-white font-semibold group-hover:text-blue-400 transition">
                Kelola Smartphone
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Tambah, edit, hapus data HP
              </p>
            </div>
          </Link>

          {/* Kelola Brand */}
          <Link href="/admin/brands">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition group cursor-pointer">
              <span className="text-4xl mb-4 block">🏷️</span>
              <h3 className="text-white font-semibold group-hover:text-blue-400 transition">
                Kelola Brand
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Tambah, edit, hapus brand
              </p>
            </div>
          </Link>

          {/* Kelola Review */}
          <Link href="/admin/reviews">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition group cursor-pointer">
              <span className="text-4xl mb-4 block">⭐</span>
              <h3 className="text-white font-semibold group-hover:text-blue-400 transition">
                Kelola Reviews
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Moderasi review pengguna
              </p>
            </div>
          </Link>

          {/* Import Data */}
          <Link href="/admin/import">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition group cursor-pointer">
              <span className="text-4xl mb-4 block">📥</span>
              <h3 className="text-white font-semibold group-hover:text-blue-400 transition">
                Import Data
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Import data HP dari JSON
              </p>
            </div>
          </Link>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex gap-4">
            <span className="text-3xl">🚧</span>
            <div>
              <h3 className="text-blue-400 font-semibold mb-1">Dalam Pengembangan</h3>
              <p className="text-slate-300 text-sm">
                Fitur-fitur admin sedang dalam pengembangan. 
                Klik menu di atas untuk melihat progress.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}