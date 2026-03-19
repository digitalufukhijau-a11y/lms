'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { EmptyState } from '@/components/empty-state'
import { 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  BarChart3
} from 'lucide-react'

export default function InstructorDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 0,
    totalRevenue: 0,
  })
  const [courses, setCourses] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // Fetch instructor's courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select(`
          *,
          _count:enrollments(count)
        `)
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false })

      setCourses(coursesData || [])

      // Calculate stats
      const totalStudents = coursesData?.reduce((sum, course) => 
        sum + (course._count?.enrollments || 0), 0
      ) || 0

      setStats({
        totalCourses: coursesData?.length || 0,
        totalStudents,
        avgRating: 4.8, // TODO: Calculate from actual ratings
        totalRevenue: 0, // TODO: Calculate from enrollments
      })

      // Fetch recent activities (enrollments)
      const { data: activities } = await supabase
        .from('enrollments')
        .select(`
          *,
          student:profiles!student_id(full_name),
          course:courses!course_id(title)
        `)
        .in('course_id', coursesData?.map(c => c.id) || [])
        .order('enrolled_at', { ascending: false })
        .limit(5)

      setRecentActivities(activities || [])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-ink-900 mb-2">
              Dashboard Instruktur
            </h1>
            <p className="text-ink-600">
              Kelola kursus dan pantau progress mahasiswa
            </p>
          </div>
          <Button variant="primary" asChild>
            <Link href="/instructor/courses/new">
              <Plus className="w-4 h-4 mr-2" />
              Buat Kursus Baru
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-brand-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-success-500" />
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.totalCourses}
              </div>
              <div className="text-sm text-ink-600">Total Kursus</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.totalStudents}
              </div>
              <div className="text-sm text-ink-600">Total Mahasiswa</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-warn-500/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-warn-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.avgRating.toFixed(1)}
              </div>
              <div className="text-sm text-ink-600">Rating Rata-rata</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-success-500/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-success-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {courses.filter(c => c.status === 'published').length}
              </div>
              <div className="text-sm text-ink-600">Kursus Aktif</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Kursus Saya</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/instructor/courses">Lihat Semua</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="Belum ada kursus"
                    description="Mulai berbagi pengetahuan dengan membuat kursus pertama Anda"
                    action={
                      <Button variant="primary" asChild>
                        <Link href="/instructor/courses/new">
                          <Plus className="w-4 h-4 mr-2" />
                          Buat Kursus
                        </Link>
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-brand-500 hover:bg-brand-50/20 transition-all"
                      >
                        <div className="w-16 h-16 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <BookOpen className="w-8 h-8 text-ink-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-ink-900 truncate mb-1">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-ink-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {course._count?.enrollments || 0} siswa
                            </span>
                            <Badge 
                              variant={course.status === 'published' ? 'success' : 'neutral'}
                              className="text-xs"
                            >
                              {course.status === 'published' ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/instructor/courses/${course.id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/instructor/courses/${course.id}/analytics`}>
                              <BarChart3 className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-6 text-ink-600 text-sm">
                    Belum ada aktivitas
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 rounded-lg border border-border"
                    >
                      <p className="text-sm text-ink-900 mb-1">
                        <strong>{activity.student?.full_name}</strong> mendaftar
                      </p>
                      <p className="text-xs text-ink-600 truncate">
                        {activity.course?.title}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/instructor/courses/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Kursus Baru
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/instructor/quizzes/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Kuis Baru
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/instructor/analytics">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Lihat Analitik
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
