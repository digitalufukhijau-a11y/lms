'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Save, Settings as SettingsIcon } from 'lucide-react'

export default function SystemSettingsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    site_name: 'LMS Kampus',
    site_description: 'Platform pembelajaran online kampus',
    contact_email: 'admin@lmskampus.ac.id',
    max_upload_size: '10',
    enable_registration: 'true',
    enable_course_reviews: 'true',
    passing_score_default: '70',
    certificate_enabled: 'true'
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const { data } = await supabase
        .from('system_settings')
        .select('*')

      if (data) {
        const settingsObj = {}
        data.forEach(item => {
          settingsObj[item.key] = item.value
        })
        setSettings({ ...settings, ...settingsObj })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('system_settings')
          .upsert({
            key,
            value,
            updated_at: new Date().toISOString()
          })

        if (error) throw error
      }

      alert('Pengaturan berhasil disimpan!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Gagal menyimpan pengaturan')
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-ink-900 mb-2">
            Pengaturan Sistem
          </h1>
          <p className="text-ink-600">
            Konfigurasi pengaturan platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Pengaturan Umum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name">Nama Situs</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="site_description">Deskripsi Situs</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="contact_email">Email Kontak</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Kursus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="passing_score_default">Nilai Kelulusan Default (%)</Label>
                <Input
                  id="passing_score_default"
                  type="number"
                  value={settings.passing_score_default}
                  onChange={(e) => setSettings({ ...settings, passing_score_default: e.target.value })}
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <Label htmlFor="max_upload_size">Maksimal Ukuran Upload (MB)</Label>
                <Input
                  id="max_upload_size"
                  type="number"
                  value={settings.max_upload_size}
                  onChange={(e) => setSettings({ ...settings, max_upload_size: e.target.value })}
                  min="1"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.enable_course_reviews === 'true'}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      enable_course_reviews: e.target.checked ? 'true' : 'false' 
                    })}
                    className="rounded"
                  />
                  <span>Aktifkan review kursus</span>
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.certificate_enabled === 'true'}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      certificate_enabled: e.target.checked ? 'true' : 'false' 
                    })}
                    className="rounded"
                  />
                  <span>Aktifkan sertifikat</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* User Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.enable_registration === 'true'}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    enable_registration: e.target.checked ? 'true' : 'false' 
                  })}
                  className="rounded"
                />
                <span>Aktifkan pendaftaran pengguna baru</span>
              </label>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => window.history.back()}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
