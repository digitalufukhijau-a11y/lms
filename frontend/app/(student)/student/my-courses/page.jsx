'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/loading-spinner'
import { EmptyState } from '@/components/empty-state'
import { BookOpen, PlayCircle, Clock } from 'lucide-react'

export default function MyCoursesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [enrollments, setEnrollments] = useState([])
  const [filter, setFilter] = useState('all') // all, in-progress, completed

  useEffect(() => {
    fetchEnrollments()
  }, [])

  async function fetchEnrollments() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(
            id,
            title,
            slug,
            thumbnail_url,
            description,
            instructor:profiles!instructor_id(full_name)
          )
        `)
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false })

      setEnrollments(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEnrollments = enrollments.filter(e => {
    if (filter === 'in-progress') return e.progress < 100
    if (filter === 'completed') return e.progress === 100
    return true
  })

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
          <h1 className="text-3xl font-serif text-ink-900 mb-2">Kursus Saya</h1>
          <p className="text-ink-600">Kelola dan lanjutkan pembelajaran Anda</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'Semua' },
            { key: 'in-progress', label: 'Sedang Berjalan' },
            { key: 'completed', label: 'Selesai' }
          ].map(({ key, label }) => (
            <Badge
              key={key}
              variant={filter === key ? 'brand' : 'neutral'}
              className="cursor-pointer"
              onClick={() => setFilter(key)}
            >
              {label}
            </Badge>
          ))}
        </div>

        {filteredEnrollments.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Belum ada kursus"
            description="Mulai perjalanan belajar Anda dengan mendaftar kursus"
            action={
              <Button variant="primary" onClick={() => router.push('/courses')}>
                Jelajahi Kursus
              </Button>
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => (
              <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-surface-2 relative">
                  {enrollment.course.thumbnail_url ? (
                    <img 
                      src={enrollment.course.thumbnail_url}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-ink-400" />
                    </div>
                  )}
                  {enrollment.progress === 100 && (
                    <Badge variant="success" className="absolute top-2 right-2">
                      Selesai
                    </Badge>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-ink-900 line-clamp-2">
                    {enrollment.course.title}
                  </h3>
                  <p className="text-sm text-ink-600">
                    {enrollment.course.instructor?.full_name}
                  </p>
                  <Progress value={enrollment.progress || 0} showPercentage />
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => router.push(`/student/courses/${enrollment.course.slug}/learn`)}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {enrollment.progress === 0 ? 'Mulai Belajar' : 'Lanjutkan'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
