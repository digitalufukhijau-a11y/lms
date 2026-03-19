'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  TrendingUp, 
  Award, 
  Clock,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react'

export default function CourseAnalyticsPage() {
  const params = useParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)
  const [analytics, setAnalytics] = useState({
    totalEnrollments: 0,
    activeStudents: 0,
    completedStudents: 0,
    avgProgress: 0,
    avgQuizScore: 0,
    totalRevenue: 0
  })
  const [studentProgress, setStudentProgress] = useState([])

  useEffect(() => {
    fetchAnalytics()
  }, [params.id])

  async function fetchAnalytics() {
    try {
      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .single()

      setCourse(courseData)

      // Fetch enrollments
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          *,
          student:profiles!student_id(full_name, avatar_url)
        `)
        .eq('course_id', params.id)

      const totalEnrollments = enrollments?.length || 0
      const activeStudents = enrollments?.filter(e => e.status === 'active').length || 0
      const completedStudents = enrollments?.filter(e => e.status === 'completed').length || 0

      // Fetch quiz attempts for avg score
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('score, quiz_id')
        .in('quiz_id', await getQuizIds(params.id))

      const avgQuizScore = attempts?.length 
        ? attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length 
        : 0

      setAnalytics({
        totalEnrollments,
        activeStudents,
        completedStudents,
        avgProgress: totalEnrollments ? (completedStudents / totalEnrollments) * 100 : 0,
        avgQuizScore,
        totalRevenue: totalEnrollments * (courseData?.price || 0)
      })

      // Calculate student progress
      const progressData = await Promise.all(
        (enrollments || []).slice(0, 10).map(async (enrollment) => {
          const { data: progress } = await supabase
            .from('lesson_progress')
            .select('is_completed')
            .eq('student_id', enrollment.student_id)

          const completed = progress?.filter(p => p.is_completed).length || 0
          const total = progress?.length || 1

          return {
            student: enrollment.student,
            progress: (completed / total) * 100,
            status: enrollment.status
          }
        })
      )

      setStudentProgress(progressData)

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  async function getQuizIds(courseId) {
    const { data } = await supabase
      .from('quizzes')
      .select('id')
      .eq('course_id', courseId)
    
    return data?.map(q => q.id) || []
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
          <h1 className="text-3xl font-serif text-ink-900 mb-2">
            Analitik Kursus
          </h1>
          <p className="text-ink-600">{course?.title}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {analytics.totalEnrollments}
              </div>
              <div className="text-sm text-ink-600">Total Pendaftar</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {analytics.activeStudents}
              </div>
              <div className="text-sm text-ink-600">Mahasiswa Aktif</div>
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
                {analytics.completedStudents}
              </div>
              <div className="text-sm text-ink-600">Selesai</div>
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
                {analytics.avgProgress.toFixed(0)}%
              </div>
              <div className="text-sm text-ink-600">Rata-rata Progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-info-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-info-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                {analytics.avgQuizScore.toFixed(0)}
              </div>
              <div className="text-sm text-ink-600">Rata-rata Nilai Kuis</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-brand-500" />
                </div>
              </div>
              <div className="text-3xl font-serif text-ink-900 mb-1">
                Rp {analytics.totalRevenue.toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-ink-600">Total Pendapatan</div>
            </CardContent>
          </Card>
        </div>

        {/* Student Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentProgress.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-brand-500">
                      {item.student?.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-ink-900">
                        {item.student?.full_name || 'Unknown'}
                      </span>
                      <Badge 
                        variant={item.status === 'completed' ? 'success' : 'neutral'}
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={item.progress} className="flex-1" />
                      <span className="text-xs text-ink-600 w-12 text-right">
                        {item.progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
