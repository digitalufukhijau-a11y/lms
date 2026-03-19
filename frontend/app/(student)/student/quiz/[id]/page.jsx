'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { 
  Clock,
  AlertCircle,
  CheckCircle2,
  Flag
} from 'lucide-react'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    fetchQuizData()
  }, [params.id])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  async function fetchQuizData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch quiz
      const { data: quizData } = await supabase
        .from('quizzes')
        .select(`
          *,
          course:courses(title)
        `)
        .eq('id', params.id)
        .single()

      setQuiz(quizData)

      // Fetch questions
      const { data: questionsData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', params.id)
        .order('order_index', { ascending: true })

      setQuestions(questionsData || [])

      // Set timer if quiz has time limit
      if (quizData.time_limit_minutes) {
        setTimeLeft(quizData.time_limit_minutes * 60)
      }

    } catch (error) {
      console.error('Error fetching quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAutoSubmit() {
    await handleSubmit(true)
  }

  async function handleSubmit(isAuto = false) {
    if (submitting) return
    
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Calculate score
      let correctCount = 0
      questions.forEach(question => {
        const userAnswer = answers[question.id]
        if (userAnswer === question.correct_answer) {
          correctCount++
        }
      })

      const score = (correctCount / questions.length) * 100

      // Save attempt
      const { data: attempt } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quiz.id,
          student_id: user.id,
          score,
          answers: answers,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single()

      // Redirect to results
      router.push(`/student/quiz/${params.id}/result/${attempt.id}`)

    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Gagal submit kuis')
    } finally {
      setSubmitting(false)
    }
  }

  function handleAnswerSelect(questionId, answer) {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  function toggleFlag(questionId) {
    setFlagged(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(answers).length
  const flaggedCount = flagged.size

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-1">
      {/* Header */}
      <div className="bg-surface-0 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-lg font-semibold text-ink-900">{quiz?.title}</h1>
              <p className="text-sm text-ink-600">{quiz?.course?.title}</p>
            </div>
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-danger-500/10 text-danger-500' : 'bg-surface-2 text-ink-900'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {currentQuestion && (
                <>
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="brand">
                          Soal {currentQuestionIndex + 1} dari {questions.length}
                        </Badge>
                        {currentQuestion.points && (
                          <Badge variant="neutral">
                            {currentQuestion.points} poin
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-ink-900">
                        {currentQuestion.question_text}
                      </h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFlag(currentQuestion.id)}
                    >
                      <Flag className={`w-5 h-5 ${
                        flagged.has(currentQuestion.id) ? 'fill-warn-500 text-warn-500' : 'text-ink-400'
                      }`} />
                    </Button>
                  </div>

                  {/* Question Image */}
                  {currentQuestion.image_url && (
                    <img
                      src={currentQuestion.image_url}
                      alt="Question"
                      className="max-h-64 rounded-lg mb-6"
                    />
                  )}

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => {
                      const optionKey = String.fromCharCode(65 + index) // A, B, C, D
                      const isSelected = answers[currentQuestion.id] === optionKey

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(currentQuestion.id, optionKey)}
                          className={`
                            w-full flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all
                            ${isSelected 
                              ? 'border-brand-500 bg-brand-50' 
                              : 'border-border hover:border-brand-500/50 hover:bg-surface-2'
                            }
                          `}
                        >
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-medium
                            ${isSelected 
                              ? 'bg-brand-500 text-white' 
                              : 'bg-surface-2 text-ink-600'
                            }
                          `}>
                            {optionKey}
                          </div>
                          <span className="text-ink-900 flex-1">{option}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      Sebelumnya
                    </Button>

                    {currentQuestionIndex === questions.length - 1 ? (
                      <Button
                        variant="primary"
                        onClick={() => setShowConfirm(true)}
                      >
                        Submit Kuis
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                      >
                        Selanjutnya
                      </Button>
                    )}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-24">
              <h3 className="font-semibold text-ink-900 mb-4">Navigator Soal</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((question, index) => {
                  const isAnswered = answers[question.id] !== undefined
                  const isFlagged = flagged.has(question.id)
                  const isCurrent = index === currentQuestionIndex

                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`
                        aspect-square rounded-lg text-sm font-medium transition-all relative
                        ${isCurrent 
                          ? 'bg-brand-500 text-white ring-2 ring-brand-500 ring-offset-2' 
                          : isAnswered
                            ? 'bg-success-500 text-white'
                            : 'bg-surface-2 text-ink-600 hover:bg-surface-2/80'
                        }
                      `}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag className="w-3 h-3 fill-warn-500 text-warn-500 absolute -top-1 -right-1" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">Dijawab</span>
                  <span className="font-medium text-ink-900">{answeredCount}/{questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">Ditandai</span>
                  <span className="font-medium text-ink-900">{flaggedCount}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-warn-500/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-warn-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink-900 mb-2">
                  Submit Kuis?
                </h3>
                <p className="text-sm text-ink-600">
                  Anda telah menjawab {answeredCount} dari {questions.length} soal.
                  {answeredCount < questions.length && ' Soal yang belum dijawab akan dianggap salah.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
                disabled={submitting}
              >
                Review Lagi
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSubmit(false)}
                className="flex-1"
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Sekarang'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
