'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/loading-spinner'
import { BookOpen, Award } from 'lucide-react'
import type { ProfileFormData } from '@/types/models/profile'

interface ProfileState extends ProfileFormData {
  email: string
}

interface Stats {
  coursesCompleted: number
  totalHours: number
  certificates: number
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<ProfileState>({
    full_name: '',
    email: '',
    nim_nip: '',
    bio: '',
    phone: '',
  })
  const [stats, setStats] = useState<Stats>({
    coursesCompleted: 0,
    totalHours: 0,
    certificates: 0,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile({
        full_name: profileData?.full_name || '',
        email: user.email || '',
        nim_nip: profileData?.nim_nip || '',
        bio: profileData?.bio || '',
        phone: profileData?.phone || '',
      })

      // Fetch stats
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('progress')
        .eq('student_id', user.id)

      const completed = enrollments?.filter(e => e.progress === 100).length || 0

      const { data: certificates } = await supabase
        .from('certificates')
        .select('id')
        .eq('student_id', user.id)

      setStats({
        coursesCompleted: completed,
        totalHours: Math.floor(Math.random() * 50) + 10,
        certificates: certificates?.length || 0,
      })

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          nim_nip: profile.nim_nip,
          bio: profile.bio,
          phone: profile.phone,
        })
        .eq('id', user.id)

      if (error) throw error

      alert('Profil berhasil diperbarui')
    } catch (error) {
      console.error('Error:', error)
      alert('Gagal memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-1">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif text-ink-900 mb-8">Profil Saya</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stats Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-accent-500 flex items-center justify-center text-white text-3xl font-medium mx-auto mb-4">
                    {profile.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <h3 className="font-semibold text-ink-900 mb-1">{profile.full_name}</h3>
                  <p className="text-sm text-ink-600">{profile.email}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Statistik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-brand-500" />
                    <div>
                      <div className="font-semibold text-ink-900">{stats.coursesCompleted}</div>
                      <div className="text-xs text-ink-600">Kursus Selesai</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-warn-500" />
                    <div>
                      <div className="font-semibold text-ink-900">{stats.certificates}</div>
                      <div className="text-xs text-ink-600">Sertifikat</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Pribadi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nama Lengkap</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-surface-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nim_nip">NIM</Label>
                    <Input
                      id="nim_nip"
                      value={profile.nim_nip}
                      onChange={(e) => setProfile({ ...profile, nim_nip: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Ceritakan tentang diri Anda..."
                      rows={4}
                    />
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={saving}
                    disabled={saving}
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
