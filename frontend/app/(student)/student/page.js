'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/loading-spinner'
import { EmptyState } from '@/components/empty-state'
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp,
  PlayCircle,
  Calendar,
  Target
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function StudentDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({
    activeCourses: 0,
    totalHours: 0,
    completedQuizzes: 0,
    certificates: 0,
  })
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])

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

      // Fetch enrolled courses with progress
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(
            id,
            title,
            slug,
            thumbnail_url,
            instructor:profiles!instructor_id(full_name)
          )
        `)
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false })
        .limit(6)

      setEnrolledCourses(enrollments || [])

      // Calculate stats
      const activeCourses = enrollments?.filter(e => e.progress < 100).length || 0
      const completedCourses = enrollments?.filter(e => e.progress === 100).length || 0

      setStats({
        activeCourses,
        totalHours: Math.floor(Math.random() * 50) + 10, // TODO: Calculate from actual data
        completedQuizzes: Math.floor(Math.random() * 20), // TODO: From quiz_attempts
        certificates: completedCourses,
      })

      // Fetch upcoming live sessions
      const { data: sessions } = await supabase
        .from('live_sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(3)

      setUpcomingEvents(sessions || [])

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
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-ink-900 mb-2">
            Selamat datang, {profile?.full_name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="text-ink-600">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
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
                {stats.activeCourses}
              </div>
              <div className="text-sm text-ink-600">Kursus Aktif</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.totalHours}j
              </div>
              <div className="text-sm text-ink-600">Total Jam Belajar</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-warn-500/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-warn-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.completedQuizzes}
              </div>
              <div className="text-sm text-ink-600">Kuis Diselesaikan</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-success-500/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-success-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.certificates}
              </div>
              <div className="text-sm text-ink-600">Sertifikat Diraih</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Lanjutkan Belajar</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/student/my-courses">Lihat Semua</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="Belum ada kursus"
                    description="Mulai perjalanan belajar Anda dengan mendaftar kursus"
                    action={
                      <Button variant="primary" asChild>
                        <Link href="/courses">Jelajahi Kursus</Link>
                      </Button>
                    }
                  />
                ) : (
                  enrolledCourses.slice(0, 3).map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-brand-500 hover:bg-brand-50/20 transition-all cursor-pointer"
                      onClick={() => router.push(`/student/courses/${enrollment.course.slug}/learn`)}
                    >
                      <div className="w-16 h-16 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0">
                        {enrollment.course.thumbnail_url ? (
                          <img 
                            src={enrollment.course.thumbnail_url} 
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <BookOpen className="w-8 h-8 text-ink-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-ink-900 truncate mb-1">
                          {enrollment.course.title}
                        </h4>
                        <p className="text-sm text-ink-600 mb-2">
                          {enrollment.course.instructor?.full_name}
                        </p>
                        <Progress 
                          value={enrollment.progress || 0} 
                          size="thin"
                        />
                        <p className="text-xs text-ink-600 mt-1">
                          {enrollment.progress || 0}% selesai
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <PlayCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Jadwal Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-6 text-ink-600 text-sm">
                    Tidak ada jadwal hari ini
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border border-border hover:border-brand-500 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-brand-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-ink-900 text-sm truncate">
                            {event.course?.title}
                          </h5>
                          <p className="text-xs text-ink-600 mt-1">
                            {formatDate(event.scheduled_at)}
                          </p>
                          <Badge variant="brand" className="mt-2 text-xs">
                            Live Class
                          </Badge>
                        </div>
                      </div>
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
                  <Link href="/courses">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Jelajahi Kursus
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/student/certificates">
                    <Award className="w-4 h-4 mr-2" />
                    Sertifikat Saya
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/student/profile">
                    <Target className="w-4 h-4 mr-2" />
                    Profil Saya
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
