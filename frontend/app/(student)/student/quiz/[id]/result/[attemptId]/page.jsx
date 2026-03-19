'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { 
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  RotateCcw,
  Home
} from 'lucide-react'

export default function QuizResultPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    fetchResultData()
  }, [params.attemptId])

  async function fetchResultData() {
    try {
      // Fetch attempt
      const { data: attemptData } = await supabase
        .from('quiz_attempts')
        .select(`
          *,
          quiz:quizzes(
            *,
            course:courses(title, slug)
          )
        `)
        .eq('id', params.attemptId)
        .single()

      setAttempt(attemptData)
      setQuiz(attemptData.quiz)

      // Fetch questions
      const { data: questionsData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', attemptData.quiz_id)
        .order('order_index', { ascending: true })

      setQuestions(questionsData || [])

    } catch (error) {
      console.error('Error fetching result:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const isPassed = attempt.score >= (quiz.passing_score || 70)
  const correctCount = questions.filter(q => 
    attempt.answers[q.id] === q.correct_answer
  ).length

  return (
    <div className="min-h-screen bg-surface-1">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Result Hero */}
          <Card className="p-8 text-center mb-8">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              isPassed ? 'bg-success-500/10' : 'bg-danger-500/10'
            }`}>
              {isPassed ? (
                <CheckCircle2 className="w-12 h-12 text-success-500" />
              ) : (
                <XCircle className="w-12 h-12 text-danger-500" />
              )}
            </div>

            <h1 className={`text-4xl font-serif mb-2 ${
              isPassed ? 'text-success-500' : 'text-danger-500'
            }`}>
              {isPassed ? 'LULUS!' : 'BELUM LULUS'}
            </h1>
            
            <p className="text-ink-600 mb-8">
              {isPassed 
                ? 'Selamat! Anda telah menyelesaikan kuis ini dengan baik.' 
                : 'Jangan menyerah! Coba lagi untuk hasil yang lebih baik.'}
            </p>

            <div className="text-6xl font-serif text-brand-500 mb-2">
              {Math.round(attempt.score)}%
            </div>
            <p className="text-ink-600">Skor Anda</p>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <div className="text-2xl font-serif text-ink-900">
                    {Math.round(attempt.score)}%
                  </div>
                  <div className="text-xs text-ink-600">Skor</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success-500" />
                </div>
                <div>
                  <div className="text-2xl font-serif text-ink-900">
                    {correctCount}
                  </div>
                  <div className="text-xs text-ink-600">Benar</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-danger-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-danger-500" />
                </div>
                <div>
                  <div className="text-2xl font-serif text-ink-900">
                    {questions.length - correctCount}
                  </div>
                  <div className="text-xs text-ink-600">Salah</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent-500" />
                </div>
                <div>
                  <div className="text-2xl font-serif text-ink-900">
                    {quiz.time_limit_minutes || '-'}
                  </div>
                  <div className="text-xs text-ink-600">Menit</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Review Answers */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-ink-900 mb-6">
              Review Jawaban
            </h2>

            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = attempt.answers[question.id]
                const isCorrect = userAnswer === question.correct_answer

                return (
                  <div key={question.id} className="pb-6 border-b border-border last:border-0">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? 'bg-success-500' : 'bg-danger-500'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="neutral">Soal {index + 1}</Badge>
                          {question.points && (
                            <Badge variant="neutral">{question.points} poin</Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-ink-900 mb-3">
                          {question.question_text}
                        </h3>

                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => {
                            const optionKey = String.fromCharCode(65 + optIndex)
                            const isUserAnswer = userAnswer === optionKey
                            const isCorrectAnswer = question.correct_answer === optionKey

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border ${
                                  isCorrectAnswer
                                    ? 'border-success-500 bg-success-500/10'
                                    : isUserAnswer
                                      ? 'border-danger-500 bg-danger-500/10'
                                      : 'border-border'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-ink-900">
                                    {optionKey}.
                                  </span>
                                  <span className="text-ink-900">{option}</span>
                                  {isCorrectAnswer && (
                                    <Badge variant="success" className="ml-auto">
                                      Jawaban Benar
                                    </Badge>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <Badge variant="danger" className="ml-auto">
                                      Jawaban Anda
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {question.explanation && (
                          <div className="mt-3 p-3 bg-surface-2 rounded-lg">
                            <p className="text-sm text-ink-600">
                              <strong>Penjelasan:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="ghost" asChild>
              <Link href="/student">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Link>
            </Button>
            
            {!isPassed && quiz.max_attempts && (
              <Button variant="primary" asChild>
                <Link href={`/student/quiz/${params.id}`}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Link>
              </Button>
            )}

            {isPassed && (
              <Button variant="primary" asChild>
                <Link href={`/student/courses/${quiz.course?.slug}/learn`}>
                  Lanjutkan Belajar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
