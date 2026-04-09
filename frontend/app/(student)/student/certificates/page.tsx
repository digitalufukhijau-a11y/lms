'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { EmptyState } from '@/components/empty-state'
import { Award, Download, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { CertificateWithCourse } from '@/types/models/certificate'

export default function CertificatesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [certificates, setCertificates] = useState<CertificateWithCourse[]>([])

  useEffect(() => {
    fetchCertificates()
  }, [])

  async function fetchCertificates() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('certificates')
        .select(`
          *,
          course:courses(title, instructor:profiles!instructor_id(full_name))
        `)
        .eq('student_id', user.id)
        .order('issued_at', { ascending: false })

      setCertificates((data as CertificateWithCourse[]) || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
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
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-ink-900 mb-2">Sertifikat Saya</h1>
          <p className="text-ink-600">Koleksi sertifikat yang telah Anda raih</p>
        </div>

        {certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="Belum ada sertifikat"
            description="Selesaikan kursus untuk mendapatkan sertifikat pertama Anda"
            action={
              <Button variant="primary" onClick={() => router.push('/courses')}>
                Jelajahi Kursus
              </Button>
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-brand-50 to-accent-500/10 flex items-center justify-center border-b border-border">
                  <Award className="w-20 h-20 text-brand-500" />
                </div>
                <div className="p-4 space-y-3">
                  <Badge variant="success">Verified</Badge>
                  <h3 className="font-semibold text-ink-900 line-clamp-2">
                    {cert.course?.title}
                  </h3>
                  <div className="text-sm text-ink-600 space-y-1">
                    <p>Instruktur: {cert.course?.instructor?.full_name}</p>
                    <p>Diterbitkan: {formatDate(cert.issued_at)}</p>
                    <p className="font-mono text-xs">ID: {cert.certificate_number}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
