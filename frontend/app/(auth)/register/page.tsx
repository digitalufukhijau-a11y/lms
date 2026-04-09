'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'

interface FormData {
  email: string
  password: string
  fullName: string
  role: string
  nimNip: string
}

interface PasswordStrength {
  strength: number
  label: string
  color: string
}

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
    role: 'student',
    nimNip: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Password strength indicator
  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 6) return { strength: 1, label: 'Lemah', color: 'bg-danger-500' }
    if (password.length < 10) return { strength: 2, label: 'Sedang', color: 'bg-warn-500' }
    return { strength: 3, label: 'Kuat', color: 'bg-success-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate password
      if (formData.password.length < 6) {
        throw new Error('Password minimal 6 karakter')
      }

      // Sign up with Supabase Auth
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
            nim_nip: formData.nimNip || null,
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
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal')
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
              Buat Akun Baru
            </h2>
            <p className="text-sm text-ink-600">
              Bergabung dengan LMS Kampus sekarang
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
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nama lengkap Anda"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@kampus.ac.id"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
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
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-surface-2'
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.label && (
                      <p className="text-xs text-ink-600">
                        Kekuatan password: {passwordStrength.label}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Daftar Sebagai</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: string) => setFormData({ ...formData, role: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Mahasiswa</SelectItem>
                    <SelectItem value="instructor">Dosen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nimNip">
                  {formData.role === 'student' ? 'NIM' : 'NIP'} (Opsional)
                </Label>
                <Input
                  id="nimNip"
                  type="text"
                  value={formData.nimNip}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nimNip: e.target.value })}
                  placeholder={formData.role === 'student' ? 'Nomor Induk Mahasiswa' : 'Nomor Induk Pegawai'}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                loading={loading}
                className="w-full"
              >
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
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
              Sudah punya akun?{' '}
              <Link 
                href="/login" 
                className="text-brand-500 hover:text-brand-700 font-medium transition-colors"
              >
                Login di sini
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-ink-400 mt-6">
          Dengan mendaftar, Anda menyetujui{' '}
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
