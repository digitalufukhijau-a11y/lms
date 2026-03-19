'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'student') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">LMS Kampus</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.fullName}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-destructive hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Dashboard Mahasiswa</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Kursus Aktif</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Kursus Selesai</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Sertifikat</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Kursus Saya</h3>
          <p className="text-muted-foreground">
            Belum ada kursus. Mulai belajar dengan mendaftar kursus yang tersedia.
          </p>
        </div>
      </main>
    </div>
  )
}
