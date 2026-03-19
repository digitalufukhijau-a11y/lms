'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen,
  Award,
  Download
} from 'lucide-react'

export default function ReportsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')
  const [stats, setStats] = useState({
    newUsers: 0,
    newEnrollments: 0,
    completedCourses: 0,
    avgCompletionRate: 0,
    topCourses: [],
    topInstructors: []
  })

  useEffect(() => {
    fetchReports()
  }, [timeRange])

  async function fetchReports() {
    try {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange))

      // New users
      const { data: newUsers } = await supabase
        .from('profiles')
        .select('id')
        .gte('created_at', daysAgo.toISOString())

      // New enrollments
      const { data: newEnrollments } = await supabase
        .from('enrollments')
        .select('id')
        .gte('enrolled_at', daysAgo.toISOString())

      // Completed courses
      const { data: completedCourses } = await supabase
        .from('enrollments')
        .select('id')
        .eq('status', 'completed')
        .gte('completed_at', daysAgo.toISOString())

      // Top courses by enrollments
      const { data: courses } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          enrollments:enrollments(count)
        `)
        .order('enrollments.count', { ascending: false })
        .limit(5)

      // Top instructors
      const { data: instructors } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          courses:courses(count)
        `)
        .eq('role', 'instructor')
        .order('courses.count', { ascending: false })
        .limit(5)

      setStats({
        newUsers: newUsers?.length || 0,
        newEnrollments: newEnrollments?.length || 0,
        completedCourses: completedCourses?.length || 0,
        avgCompletionRate: newEnrollments?.length 
          ? ((completedCourses?.length || 0) / newEnrollments.length) * 100 
          : 0,
        topCourses: courses || [],
        topInstructors: instructors || []
      })

    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  function exportReport() {
    // Simple CSV export
    const csv = [
      ['Metrik', 'Nilai'],
      ['Pengguna Baru', stats.newUsers],
      ['Pendaftaran Baru', stats.newEnrollments],
      ['Kursus Selesai', stats.completedCourses],
      ['Tingkat Penyelesaian', `${stats.avgCompletionRate.toFixed(1)}%`]
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-ink-900 mb-2">
              Laporan & Analitik
            </h1>
            <p className="text-ink-600">
              Monitor performa dan aktivitas platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-40"
            >
              <option value="7">7 Hari Terakhir</option>
              <option value="30">30 Hari Terakhir</option>
              <option value="90">90 Hari Terakhir</option>
              <option value="365">1 Tahun Terakhir</option>
            </Select>
            <Button variant="primary" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-success-500" />
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.newUsers}
              </div>
              <div className="text-sm text-ink-600">Pengguna Baru</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-success-500" />
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.newEnrollments}
              </div>
              <div className="text-sm text-ink-600">Pendaftaran Baru</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-success-500/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-success-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.completedCourses}
              </div>
              <div className="text-sm text-ink-600">Kursus Selesai</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-warn-500/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-warn-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.avgCompletionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-ink-600">Tingkat Penyelesaian</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Kursus Terpopuler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topCourses.length === 0 ? (
                  <div className="text-center py-6 text-ink-600 text-sm">
                    Belum ada data
                  </div>
                ) : (
                  stats.topCourses.map((course, index) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-brand-500">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-ink-900 truncate">
                          {course.title}
                        </h4>
                        <p className="text-xs text-ink-600">
                          {course.enrollments?.[0]?.count || 0} pendaftar
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Instructors */}
          <Card>
            <CardHeader>
              <CardTitle>Instruktur Terproduktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topInstructors.length === 0 ? (
                  <div className="text-center py-6 text-ink-600 text-sm">
                    Belum ada data
                  </div>
                ) : (
                  stats.topInstructors.map((instructor, index) => (
                    <div
                      key={instructor.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-accent-500">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-ink-900 truncate">
                          {instructor.full_name}
                        </h4>
                        <p className="text-xs text-ink-600">
                          {instructor.courses?.[0]?.count || 0} kursus
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
