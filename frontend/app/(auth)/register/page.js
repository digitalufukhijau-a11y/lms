'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student',
    nimNip: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
            nim_nip: formData.nimNip,
          },
        },
      })

      if (error) throw error

      // Redirect based on role
      if (formData.role === 'instructor') {
        router.push('/instructor')
      } else {
        router.push('/student')
      }
      
      router.refresh()
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
          <p className="text-sm text-muted-foreground">
            Bergabung dengan LMS Kampus
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
              <Input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 karakter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Mahasiswa</option>
                <option value="instructor">Dosen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {formData.role === 'student' ? 'NIM' : 'NIP'} (Opsional)
              </label>
              <Input
                type="text"
                value={formData.nimNip}
                onChange={(e) => setFormData({ ...formData, nimNip: e.target.value })}
                placeholder={formData.role === 'student' ? 'NIM' : 'NIP'}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Daftar'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Login di sini
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
