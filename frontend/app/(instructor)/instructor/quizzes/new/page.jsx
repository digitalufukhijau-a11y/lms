'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Plus, Save, X, Trash2 } from 'lucide-react'

export default function NewQuizPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    course_id: '',
    time_limit_minutes: 60,
    max_attempts: 3,
    passing_score: 70,
    is_randomized: false
  })

  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      options: [
        { id: Date.now() + 1, option_text: '', is_correct: false },
        { id: Date.now() + 2, option_text: '', is_correct: false }
      ]
    }
  ])

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data } = await supabase
        .from('courses')
        .select('id, title')
        .eq('instructor_id', user.id)
        .order('title')

      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  function addQuestion() {
    setQuestions([...questions, {
      id: Date.now(),
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      options: [
        { id: Date.now() + 1, option_text: '', is_correct: false },
        { id: Date.now() + 2, option_text: '', is_correct: false }
      ]
    }])
  }

  function updateQuestion(id, field, value) {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  function removeQuestion(id) {
    if (questions.length === 1) return
    setQuestions(questions.filter(q => q.id !== id))
  }

  function addOption(questionId) {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: [...q.options, { id: Date.now(), option_text: '', is_correct: false }] }
        : q
    ))
  }

  function updateOption(questionId, optionId, field, value) {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map(o => 
              o.id === optionId ? { ...o, [field]: value } : o
            ) 
          }
        : q
    ))
  }

  function removeOption(questionId, optionId) {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.filter(o => o.id !== optionId) }
        : q
    ))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert(quizData)
        .select()
        .single()

      if (quizError) throw quizError

      // Create questions and options
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i]
        
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .insert({
            quiz_id: quiz.id,
            question_text: question.question_text,
            question_type: question.question_type,
            points: question.points,
            order_index: i
          })
          .select()
          .single()

        if (questionError) throw questionError

        // Create options
        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j]
          
          const { error: optionError } = await supabase
            .from('question_options')
            .insert({
              question_id: questionData.id,
              option_text: option.option_text,
              is_correct: option.is_correct,
              order_index: j
            })

          if (optionError) throw optionError
        }
      }

      alert('Kuis berhasil dibuat!')
      router.push('/instructor')
    } catch (error) {
      console.error('Error creating quiz:', error)
      alert('Gagal membuat kuis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-ink-900 mb-2">
            Buat Kuis Baru
          </h1>
          <p className="text-ink-600">
            Buat kuis untuk menguji pemahaman mahasiswa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kuis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="course">Kursus *</Label>
                <Select
                  id="course"
                  value={quizData.course_id}
                  onChange={(e) => setQuizData({ ...quizData, course_id: e.target.value })}
                  required
                >
                  <option value="">Pilih kursus</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Judul Kuis *</Label>
                <Input
                  id="title"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={quizData.description}
                  onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="time_limit">Batas Waktu (menit)</Label>
                  <Input
                    id="time_limit"
                    type="number"
                    value={quizData.time_limit_minutes}
                    onChange={(e) => setQuizData({ ...quizData, time_limit_minutes: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="max_attempts">Maks Percobaan</Label>
                  <Input
                    id="max_attempts"
                    type="number"
                    value={quizData.max_attempts}
                    onChange={(e) => setQuizData({ ...quizData, max_attempts: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="passing_score">Nilai Lulus (%)</Label>
                  <Input
                    id="passing_score"
                    type="number"
                    value={quizData.passing_score}
                    onChange={(e) => setQuizData({ ...quizData, passing_score: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={quizData.is_randomized}
                  onChange={(e) => setQuizData({ ...quizData, is_randomized: e.target.checked })}
                  className="rounded"
                />
                <span>Acak urutan soal</span>
              </label>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-ink-900">Soal-soal</h2>
            
            {questions.map((question, qIndex) => (
              <Card key={question.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Soal {qIndex + 1}</CardTitle>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Pertanyaan *</Label>
                    <Textarea
                      value={question.question_text}
                      onChange={(e) => updateQuestion(question.id, 'question_text', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipe Soal</Label>
                      <Select
                        value={question.question_type}
                        onChange={(e) => updateQuestion(question.id, 'question_type', e.target.value)}
                      >
                        <option value="multiple_choice">Pilihan Ganda</option>
                        <option value="true_false">Benar/Salah</option>
                        <option value="essay">Essay</option>
                      </Select>
                    </div>

                    <div>
                      <Label>Poin</Label>
                      <Input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>

                  {question.question_type === 'multiple_choice' && (
                    <div className="space-y-2">
                      <Label>Pilihan Jawaban</Label>
                      {question.options.map((option, oIndex) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={option.is_correct}
                            onChange={() => {
                              setQuestions(questions.map(q => 
                                q.id === question.id 
                                  ? { 
                                      ...q, 
                                      options: q.options.map(o => ({ 
                                        ...o, 
                                        is_correct: o.id === option.id 
                                      })) 
                                    }
                                  : q
                              ))
                            }}
                            className="flex-shrink-0"
                          />
                          <Input
                            value={option.option_text}
                            onChange={(e) => updateOption(question.id, option.id, 'option_text', e.target.value)}
                            placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`}
                            required
                          />
                          {question.options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(question.id, option.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addOption(question.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Pilihan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="ghost"
              onClick={addQuestion}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Soal
            </Button>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan Kuis'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
