'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/loading-spinner'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  PlayCircle,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-react'

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [course, setCourse] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState({})
  const [activeTab, setActiveTab] = useState('about')

  useEffect(() => {
    fetchCourseData()
  }, [params.slug])

  async function fetchCourseData() {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles!instructor_id(id, full_name, avatar_url, bio),
          _count:enrollments(count)
        `)
        .eq('slug', params.slug)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Fetch chapters with lessons
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select(`
          *,
          lessons(id, title, type, duration_minutes, order_index, is_preview)
        `)
        .eq('course_id', courseData.id)
        .order('order_index', { ascending: true })

      setChapters(chaptersData || [])

      // Check if user is enrolled
      if (user) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('course_id', courseData.id)
          .eq('student_id', user.id)
          .single()

        setIsEnrolled(!!enrollment)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleEnroll() {
    setEnrolling(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('enrollments')
        .insert({
          course_id: course.id,
          student_id: user.id,
        })

      if (error) throw error

      setIsEnrolled(true)
      router.push(`/student/courses/${course.slug}/learn`)
    } catch (error) {
      console.error('Error enrolling:', error)
      alert('Gagal mendaftar kursus')
    } finally {
      setEnrolling(false)
    }
  }

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }))
  }

  const totalLessons = chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0)
  const totalDuration = chapters.reduce((sum, ch) => 
    sum + (ch.lessons?.reduce((s, l) => s + (l.duration_minutes || 0), 0) || 0), 0
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

  if (!course) {
    return (
      <div className="min-h-screen bg-surface-1">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-serif text-ink-900 mb-4">Kursus tidak ditemukan</h1>
          <Button variant="ghost" asChild>
            <Link href="/courses">Kembali ke Katalog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-brand-50/20 to-surface-1 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-ink-600 mb-4">
              <Link href="/courses" className="hover:text-brand-500">Kursus</Link>
              <span>›</span>
              <span>{course.category || 'Umum'}</span>
            </div>

            {/* Title & Meta */}
            <h1 className="text-4xl font-serif text-ink-900 mb-4">
              {course.title}
            </h1>
            <p className="text-lg text-ink-600 mb-6">
              {course.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-warn-500 text-warn-500" />
                <span className="font-medium">4.8</span>
                <span className="text-ink-600">(120 ulasan)</span>
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <Users className="w-4 h-4" />
                <span>{course._count?.enrollments || 0} siswa</span>
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(totalDuration / 60)}j {totalDuration % 60}m</span>
              </div>
              <div className="flex items-center gap-2 text-ink-600">
                <BookOpen className="w-4 h-4" />
                <span>{totalLessons} pelajaran</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
              <div className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center text-white font-medium">
                {course.instructor?.full_name?.[0] || 'I'}
              </div>
              <div>
                <p className="text-sm text-ink-600">Instruktur</p>
                <p className="font-medium text-ink-900">{course.instructor?.full_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex gap-6">
                {['about', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab
                        ? 'text-brand-500'
                        : 'text-ink-600 hover:text-ink-900'
                    }`}
                  >
                    {tab === 'about' && 'Tentang'}
                    {tab === 'curriculum' && 'Kurikulum'}
                    {tab === 'instructor' && 'Instruktur'}
                    {tab === 'reviews' && 'Ulasan'}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-ink-900 mb-3">
                    Yang Akan Kamu Pelajari
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Konsep dasar', 'Praktik langsung', 'Studi kasus', 'Project akhir'].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                        <span className="text-ink-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-ink-900 mb-3">
                    Deskripsi
                  </h3>
                  <div className="prose prose-sm max-w-none text-ink-600">
                    <p>{course.description}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <Card key={chapter.id} className="overflow-hidden">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <h4 className="font-semibold text-ink-900">{chapter.title}</h4>
                          <p className="text-sm text-ink-600">
                            {chapter.lessons?.length || 0} pelajaran
                          </p>
                        </div>
                      </div>
                      {expandedChapters[chapter.id] ? (
                        <ChevronUp className="w-5 h-5 text-ink-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-ink-400" />
                      )}
                    </button>

                    {expandedChapters[chapter.id] && (
                      <div className="border-t border-border">
                        {chapter.lessons?.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-4 hover:bg-surface-2 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.type === 'video' && <PlayCircle className="w-4 h-4 text-ink-400" />}
                              {lesson.type === 'text' && <FileText className="w-4 h-4 text-ink-400" />}
                              <span className="text-sm text-ink-900">{lesson.title}</span>
                              {lesson.is_preview && (
                                <Badge variant="brand" className="text-xs">Preview</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-ink-600">
                                {lesson.duration_minutes} menit
                              </span>
                              {!lesson.is_preview && !isEnrolled && (
                                <Lock className="w-4 h-4 text-ink-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'instructor' && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-accent-500 flex items-center justify-center text-white text-2xl font-medium flex-shrink-0">
                    {course.instructor?.full_name?.[0] || 'I'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink-900 mb-1">
                      {course.instructor?.full_name}
                    </h3>
                    <p className="text-ink-600 mb-4">
                      {course.instructor?.bio || 'Instruktur berpengalaman'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12 text-ink-600">
                Ulasan akan segera tersedia
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 space-y-6">
              {/* Price */}
              <div>
                {course.price > 0 ? (
                  <div className="text-3xl font-serif text-brand-500">
                    Rp {course.price.toLocaleString('id-ID')}
                  </div>
                ) : (
                  <div className="text-3xl font-serif text-brand-500">
                    GRATIS
                  </div>
                )}
              </div>

              {/* Enroll Button */}
              {isEnrolled ? (
                <Button 
                  variant="primary" 
                  className="w-full"
                  asChild
                >
                  <Link href={`/student/courses/${course.slug}/learn`}>
                    Lanjutkan Belajar
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleEnroll}
                  loading={enrolling}
                  disabled={enrolling}
                >
                  {enrolling ? 'Mendaftar...' : 'Daftar Sekarang'}
                </Button>
              )}

              {/* Features */}
              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-ink-400" />
                  <span className="text-ink-900">
                    {Math.floor(totalDuration / 60)} jam konten
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="w-5 h-5 text-ink-400" />
                  <span className="text-ink-900">{totalLessons} pelajaran</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-5 h-5 text-ink-400" />
                  <span className="text-ink-900">Akses selamanya</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-ink-400" />
                  <span className="text-ink-900">Sertifikat penyelesaian</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
