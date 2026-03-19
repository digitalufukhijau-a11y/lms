'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { EmptyState } from '@/components/empty-state'
import { Progress } from '@/components/ui/progress'
import { Search, Users, Mail, Calendar } from 'lucide-react'

export default function CourseStudentsPage() {
  const params = useParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [params.id])

  async function fetchStudents() {
    try {
      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .single()

      setCourse(courseData)

      // Fetch enrollments with student data
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          *,
          student:profiles!student_id(*)
        `)
        .eq('course_id', params.id)
        .order('enrolled_at', { ascending: false })

      // Calculate progress for each student
      const studentsWithProgress = await Promise.all(
        (enrollments || []).map(async (enrollment) => {
          const { data: progress } = await supabase
            .from('lesson_progress')
            .select('is_completed')
            .eq('student_id', enrollment.student_id)

          const completed = progress?.filter(p => p.is_completed).length || 0
          const total = progress?.length || 1

          return {
            ...enrollment,
            progress: (completed / total) * 100
          }
        })
      )

      setStudents(studentsWithProgress)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(s => 
    s.student?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student?.nim_nip?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <h1 className="text-3xl font-serif text-ink-900 mb-2">
            Manajemen Mahasiswa
          </h1>
          <p className="text-ink-600">{course?.title}</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari mahasiswa..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Daftar Mahasiswa ({filteredStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Belum ada mahasiswa"
                description="Belum ada mahasiswa yang mendaftar di kursus ini"
              />
            ) : (
              <div className="space-y-4">
                {filteredStudents.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="p-4 border border-border rounded-lg hover:border-brand-500 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-medium text-brand-500">
                          {enrollment.student?.full_name?.charAt(0) || '?'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-ink-900">
                              {enrollment.student?.full_name || 'Unknown'}
                            </h4>
                            {enrollment.student?.nim_nip && (
                              <p className="text-sm text-ink-600">
                                NIM: {enrollment.student.nim_nip}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant={
                              enrollment.status === 'completed' ? 'success' :
                              enrollment.status === 'active' ? 'info' : 'neutral'
                            }
                          >
                            {enrollment.status}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Progress value={enrollment.progress} className="flex-1" />
                            <span className="text-sm text-ink-600 w-12 text-right">
                              {enrollment.progress.toFixed(0)}%
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-ink-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Bergabung {new Date(enrollment.enrolled_at).toLocaleDateString('id-ID')}
                            </span>
                            {enrollment.completed_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Selesai {new Date(enrollment.completed_at).toLocaleDateString('id-ID')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
