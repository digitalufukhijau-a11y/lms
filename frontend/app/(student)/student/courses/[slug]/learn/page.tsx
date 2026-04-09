'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/loading-spinner'
import { 
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileText,
  Menu,
  X
} from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  instructor_id: string
  thumbnail_url: string | null
  price: number
  is_published: boolean
  created_at: string
  updated_at: string
}

interface Lesson {
  id: string
  chapter_id: string
  title: string
  type: 'video' | 'text'
  content: string | null
  video_url: string | null
  duration_minutes: number | null
  order_index: number
  created_at: string
  updated_at: string
}

interface Chapter {
  id: string
  course_id: string
  title: string
  order_index: number
  created_at: string
  updated_at: string
  lessons: Lesson[]
}

interface LessonProgress {
  lesson_id: string
  student_id: string
  completed: boolean
  completed_at: string | null
}

export default function CoursePlayerPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [params.slug])

  async function fetchCourseData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', params.slug)
        .single()

      setCourse(courseData)

      // Fetch chapters with lessons
      const { data: chaptersData } = await supabase
        .from('chapters')
        .select(`
          *,
          lessons(*)
        `)
        .eq('course_id', courseData.id)
        .order('order_index', { ascending: true })

      // Sort lessons within each chapter
      const sortedChapters = (chaptersData || []).map(chapter => ({
        ...chapter,
        lessons: (chapter.lessons || []).sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)
      }))

      setChapters(sortedChapters)

      // Fetch completed lessons
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('student_id', user.id)
        .eq('completed', true)

      const completed = new Set((progressData || []).map((p: LessonProgress) => p.lesson_id))
      setCompletedLessons(completed)

      // Set first lesson as current
      if (sortedChapters.length > 0 && sortedChapters[0]?.lessons.length > 0) {
        setCurrentLesson(sortedChapters[0].lessons[0] || null)
      }

    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markLessonComplete() {
    if (!currentLesson || marking) return
    
    setMarking(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      await supabase
        .from('lesson_progress')
        .upsert({
          student_id: user.id,
          lesson_id: currentLesson.id,
          completed: true,
          completed_at: new Date().toISOString()
        })

      setCompletedLessons(prev => new Set([...prev, currentLesson.id]))

      // Move to next lesson
      const nextLesson = getNextLesson()
      if (nextLesson) {
        setCurrentLesson(nextLesson)
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error)
    } finally {
      setMarking(false)
    }
  }

  function getNextLesson(): Lesson | null {
    let foundCurrent = false
    for (const chapter of chapters) {
      for (const lesson of chapter.lessons) {
        if (foundCurrent) return lesson
        if (lesson.id === currentLesson?.id) foundCurrent = true
      }
    }
    return null
  }

  function getPrevLesson(): Lesson | null {
    let prevLesson: Lesson | null = null
    for (const chapter of chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === currentLesson?.id) return prevLesson
        prevLesson = lesson
      }
    }
    return null
  }

  const totalLessons = chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)
  const completedCount = completedLessons.size
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-1 flex flex-col">
      {/* Header */}
      <div className="bg-surface-0 border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/student')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-ink-900 truncate">
                {course?.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={progressPercentage} size="thin" className="w-32" />
                <span className="text-xs text-ink-600">
                  {completedCount}/{totalLessons}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Lesson Content */}
            {currentLesson && (
              <>
                <div>
                  <Badge variant="brand" className="mb-3">
                    {currentLesson.type === 'video' ? 'Video' : 'Teks'}
                  </Badge>
                  <h2 className="text-3xl font-serif text-ink-900 mb-4">
                    {currentLesson.title}
                  </h2>
                </div>

                {/* Video Player */}
                {currentLesson.type === 'video' && currentLesson.video_url && (
                  <div className="aspect-video bg-black rounded-xl overflow-hidden">
                    <video
                      controls
                      className="w-full h-full"
                      src={currentLesson.video_url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Text Content */}
                {currentLesson.content && (
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-ink-900"
                      dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const prev = getPrevLesson()
                      if (prev) setCurrentLesson(prev)
                    }}
                    disabled={!getPrevLesson()}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Sebelumnya
                  </Button>

                  {!completedLessons.has(currentLesson.id) && (
                    <Button
                      variant="primary"
                      onClick={markLessonComplete}
                      loading={marking}
                      disabled={marking}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Tandai Selesai
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => {
                      const next = getNextLesson()
                      if (next) setCurrentLesson(next)
                    }}
                    disabled={!getNextLesson()}
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`
            w-80 bg-surface-0 border-l border-border overflow-y-auto
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            lg:translate-x-0
            fixed lg:relative inset-y-0 right-0 z-20
          `}
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-ink-900">Konten Kursus</h3>
            <p className="text-sm text-ink-600 mt-1">
              {completedCount} dari {totalLessons} selesai
            </p>
          </div>

          <div className="p-4 space-y-4">
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id}>
                <h4 className="font-semibold text-ink-900 mb-2 text-sm">
                  Bab {chapterIndex + 1}: {chapter.title}
                </h4>
                <div className="space-y-1">
                  {chapter.lessons.map((lesson) => {
                    const isCompleted = completedLessons.has(lesson.id)
                    const isCurrent = currentLesson?.id === lesson.id

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`
                          w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                          ${isCurrent 
                            ? 'bg-brand-50 border border-brand-500' 
                            : 'hover:bg-surface-2'
                          }
                        `}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-success-500" />
                          ) : lesson.type === 'video' ? (
                            <PlayCircle className="w-5 h-5 text-ink-400" />
                          ) : (
                            <FileText className="w-5 h-5 text-ink-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${
                            isCurrent ? 'text-brand-700 font-medium' : 'text-ink-900'
                          }`}>
                            {lesson.title}
                          </p>
                          {lesson.duration_minutes && (
                            <p className="text-xs text-ink-600">
                              {lesson.duration_minutes} menit
                            </p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
