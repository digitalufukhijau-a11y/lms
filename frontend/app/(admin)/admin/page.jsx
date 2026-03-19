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
import { 
  Users, 
  BookOpen, 
  TrendingUp,
  Award,
  Settings,
  BarChart3,
  UserCog,
  FileText
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalInstructors: 0,
    totalStudents: 0,
    activeCourses: 0
  })
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

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        router.push('/')
        return
      }

      // Fetch stats
      const { data: users } = await supabase
        .from('profiles')
        .select('role')

      const { data: courses } = await supabase
        .from('courses')
        .select('status')

      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id')

      setStats({
        totalUsers: users?.length || 0,
        totalCourses: courses?.length || 0,
        totalEnrollments: enrollments?.length || 0,
        totalInstructors: users?.filter(u => u.role === 'instructor').length || 0,
        totalStudents: users?.filter(u => u.role === 'student').length || 0,
        activeCourses: courses?.filter(c => c.status === 'published').length || 0
      })

      // Fetch recent enrollments
      const { data: activities } = await supabase
        .from('enrollments')
        .select(`
          *,
          student:profiles!student_id(full_name),
          course:courses!course_id(title)
        `)
        .order('enrolled_at', { ascending: false })
        .limit(10)

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
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-ink-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-ink-600">
            Kelola sistem dan monitor aktivitas platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.totalUsers}
              </div>
              <div className="text-sm text-ink-600">Total Pengguna</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent-500" />
                </div>
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
                <div className="w-12 h-12 rounded-lg bg-success-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.totalEnrollments}
              </div>
              <div className="text-sm text-ink-600">Total Pendaftaran</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-warn-500/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-warn-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {stats.activeCourses}
              </div>
              <div className="text-sm text-ink-600">Kursus Aktif</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                          <strong>{activity.student?.full_name}</strong> mendaftar di
                        </p>
                        <p className="text-xs text-ink-600 truncate mb-1">
                          {activity.course?.title}
                        </p>
                        <p className="text-xs text-ink-400">
                          {new Date(activity.enrolled_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Pengguna</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-brand-500" />
                      <span className="font-medium text-ink-900">Mahasiswa</span>
                    </div>
                    <Badge variant="brand">{stats.totalStudents}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <UserCog className="w-5 h-5 text-accent-500" />
                      <span className="font-medium text-ink-900">Instruktur</span>
                    </div>
                    <Badge variant="accent">{stats.totalInstructors}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Menu Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin/users">
                    <Users className="w-4 h-4 mr-2" />
                    Kelola Pengguna
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin/reports">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Laporan & Analitik
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/admin/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan Sistem
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Info Sistem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-600">Platform</span>
                  <span className="font-medium text-ink-900">LMS Kampus</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600">Versi</span>
                  <span className="font-medium text-ink-900">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600">Status</span>
                  <Badge variant="success">Online</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
