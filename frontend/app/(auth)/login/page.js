'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      // Get user profile to determine role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      // Redirect based on role
      if (profile?.role === 'admin') {
        router.push('/admin')
      } else if (profile?.role === 'instructor') {
        router.push('/instructor')
      } else {
        router.push('/student')
      }
      
      router.refresh()
    } catch (err) {
      setError(err.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-1 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-serif text-brand-500">LMS Kampus</h1>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2 pb-6">
            <h2 className="text-2xl font-serif text-ink-900">
              Selamat Datang Kembali
            </h2>
            <p className="text-sm text-ink-600">
              Login ke akun LMS Kampus Anda
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="bg-[#FEE2E2] border border-danger-500 text-danger-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@kampus.ac.id"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-brand-500 hover:text-brand-700 transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                loading={loading}
                className="w-full"
              >
                {loading ? 'Memproses...' : 'Login'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface-0 px-2 text-ink-400">
                  atau
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-ink-600">
              Belum punya akun?{' '}
              <Link 
                href="/register" 
                className="text-brand-500 hover:text-brand-700 font-medium transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-ink-400 mt-6">
          Dengan login, Anda menyetujui{' '}
          <Link href="/terms" className="text-brand-500 hover:underline">
            Syarat & Ketentuan
          </Link>{' '}
          dan{' '}
          <Link href="/privacy" className="text-brand-500 hover:underline">
            Kebijakan Privasi
          </Link>
        </p>
      </div>
    </div>
  )
}
