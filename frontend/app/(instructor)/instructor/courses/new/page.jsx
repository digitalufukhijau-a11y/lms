'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Plus, Save, X, ChevronRight, Upload } from 'lucide-react'

export default function NewCoursePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    slug: '',
    price: 0,
    passing_score: 70,
    status: 'draft',
    thumbnail_url: ''
  })

  const [chapters, setChapters] = useState([
    { id: Date.now(), title: '', lessons: [] }
  ])

  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function handleTitleChange(value) {
    setCourseData({
      ...courseData,
      title: value,
      slug: generateSlug(value)
    })
  }

  function addChapter() {
    setChapters([...chapters, { id: Date.now(), title: '', lessons: [] }])
  }

  function updateChapter(id, field, value) {
    setChapters(chapters.map(ch => 
      ch.id === id ? { ...ch, [field]: value } : ch
    ))
  }

  function removeChapter(id) {
    setChapters(chapters.filter(ch => ch.id !== id))
  }

  function addLesson(chapterId) {
    setChapters(chapters.map(ch => 
      ch.id === chapterId 
        ? { ...ch, lessons: [...ch.lessons, { 
            id: Date.now(), 
            title: '', 
            content_type: 'video',
            content_url: '',
            duration_seconds: 0,
            is_free_preview: false
          }] }
        : ch
    ))
  }

  function updateLesson(chapterId, lessonId, field, value) {
    setChapters(chapters.map(ch => 
      ch.id === chapterId 
        ? { 
            ...ch, 
            lessons: ch.lessons.map(l => 
              l.id === lessonId ? { ...l, [field]: value } : l
            ) 
          }
        : ch
    ))
  }

  function removeLesson(chapterId, lessonId) {
    setChapters(chapters.map(ch => 
      ch.id === chapterId 
        ? { ...ch, lessons: ch.lessons.filter(l => l.id !== lessonId) }
        : ch
    ))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Create course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          instructor_id: user.id
        })
        .select()
        .single()

      if (courseError) throw courseError

      // Create chapters and lessons
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i]
        
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapters')
          .insert({
            course_id: course.id,
            title: chapter.title,
            order_index: i
          })
          .select()
          .single()

        if (chapterError) throw chapterError

        // Create lessons
        for (let j = 0; j < chapter.lessons.length; j++) {
          const lesson = chapter.lessons[j]
          
          const { error: lessonError } = await supabase
            .from('lessons')
            .insert({
              chapter_id: chapterData.id,
              title: lesson.title,
              content_type: lesson.content_type,
              content_url: lesson.content_url,
              duration_seconds: lesson.duration_seconds,
              is_free_preview: lesson.is_free_preview,
              order_index: j
            })

          if (lessonError) throw lessonError
        }
      }

      router.push('/instructor')
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Gagal membuat kursus. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-ink-900 mb-2">
            Buat Kursus Baru
          </h1>
          <p className="text-ink-600">
            Isi informasi kursus dan buat kurikulum pembelajaran
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-500' : 'text-ink-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-brand-500 text-white' : 'bg-surface-2'}`}>
              1
            </div>
            <span className="text-sm font-medium">Info Dasar</span>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-400" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-500' : 'text-ink-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-brand-500 text-white' : 'bg-surface-2'}`}>
              2
            </div>
            <span className="text-sm font-medium">Kurikulum</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kursus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Judul Kursus *</Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Contoh: Pemrograman Web dengan React"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug URL</Label>
                  <Input
                    id="slug"
                    value={courseData.slug}
                    onChange={(e) => setCourseData({ ...courseData, slug: e.target.value })}
                    placeholder="pemrograman-web-react"
                  />
                  <p className="text-xs text-ink-600 mt-1">
                    URL: /courses/{courseData.slug || 'slug-kursus'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    placeholder="Jelaskan tentang kursus ini..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Harga (Rp)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={courseData.price}
                      onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) })}
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="passing_score">Nilai Kelulusan (%)</Label>
                    <Input
                      id="passing_score"
                      type="number"
                      value={courseData.passing_score}
                      onChange={(e) => setCourseData({ ...courseData, passing_score: parseInt(e.target.value) })}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="thumbnail">URL Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    value={courseData.thumbnail_url}
                    onChange={(e) => setCourseData({ ...courseData, thumbnail_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => router.back()}>
                    Batal
                  </Button>
                  <Button type="button" variant="primary" onClick={() => setStep(2)}>
                    Lanjut ke Kurikulum
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Curriculum */}
          {step === 2 && (
            <div className="space-y-6">
              {chapters.map((chapter, chapterIndex) => (
                <Card key={chapter.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Bab {chapterIndex + 1}</CardTitle>
                    {chapters.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeChapter(chapter.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Judul Bab *</Label>
                      <Input
                        value={chapter.title}
                        onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                        placeholder="Contoh: Pengenalan React"
                        required
                      />
                    </div>

                    {/* Lessons */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Materi</Label>
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="p-4 border border-border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-ink-900">
                              Materi {lessonIndex + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeLesson(chapter.id, lesson.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          <Input
                            value={lesson.title}
                            onChange={(e) => updateLesson(chapter.id, lesson.id, 'title', e.target.value)}
                            placeholder="Judul materi"
                            required
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <Select
                              value={lesson.content_type}
                              onChange={(e) => updateLesson(chapter.id, lesson.id, 'content_type', e.target.value)}
                            >
                              <option value="video">Video</option>
                              <option value="pdf">PDF</option>
                              <option value="text">Teks</option>
                              <option value="quiz">Kuis</option>
                            </Select>

                            <Input
                              type="number"
                              value={lesson.duration_seconds}
                              onChange={(e) => updateLesson(chapter.id, lesson.id, 'duration_seconds', parseInt(e.target.value))}
                              placeholder="Durasi (detik)"
                            />
                          </div>

                          <Input
                            value={lesson.content_url}
                            onChange={(e) => updateLesson(chapter.id, lesson.id, 'content_url', e.target.value)}
                            placeholder="URL konten"
                          />

                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={lesson.is_free_preview}
                              onChange={(e) => updateLesson(chapter.id, lesson.id, 'is_free_preview', e.target.checked)}
                              className="rounded"
                            />
                            <span>Preview gratis</span>
                          </label>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addLesson(chapter.id)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Materi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="ghost"
                onClick={addChapter}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Bab
              </Button>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Menyimpan...' : 'Simpan Kursus'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
