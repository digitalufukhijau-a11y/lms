'use client'

import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, GraduationCap, Shield } from 'lucide-react'

export default function DemoPage() {
  const router = useRouter()

  const demoAccounts = [
    {
      role: 'student',
      title: 'Student Demo',
      description: 'Test student dashboard, courses, quizzes, dan certificates',
      icon: GraduationCap,
      color: 'brand',
      routes: [
        '/student',
        '/student/my-courses',
        '/student/profile',
        '/student/certificates',
        '/student/courses/demo-course/learn',
        '/student/quiz/demo-quiz',
      ]
    },
    {
      role: 'instructor',
      title: 'Instructor Demo',
      description: 'Test instructor dashboard, create courses, quizzes, dan analytics',
      icon: User,
      color: 'accent',
      routes: [
        '/instructor',
        '/instructor/courses/new',
        '/instructor/quizzes/new',
        '/instructor/live-classes',
      ]
    },
    {
      role: 'admin',
      title: 'Admin Demo',
      description: 'Test admin dashboard, user management, settings, dan reports',
      icon: Shield,
      color: 'danger',
      routes: [
        '/admin',
        '/admin/users',
        '/admin/settings',
        '/admin/reports',
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-surface-1">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-ink-900 mb-4">
            🎨 Demo Mode - Test All Pages
          </h1>
          <p className="text-lg text-ink-600 mb-2">
            Pilih role untuk test pages tanpa perlu login
          </p>
          <p className="text-sm text-ink-500">
            (Beberapa pages akan error karena belum ada Supabase, tapi UI bisa dilihat)
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {demoAccounts.map((account) => {
            const Icon = account.icon
            return (
              <Card key={account.role} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full bg-${account.color}-50 flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 text-${account.color}-500`} />
                  </div>
                  <CardTitle className="text-center">{account.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ink-600 text-center mb-6">
                    {account.description}
                  </p>
                  <div className="space-y-2">
                    {account.routes.map((route) => (
                      <Button
                        key={route}
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => router.push(route)}
                      >
                        {route}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Public Pages */}
        <Card>
          <CardHeader>
            <CardTitle>🌐 Public Pages (No Login Required)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              <Button variant="ghost" onClick={() => router.push('/')}>
                🏠 Landing Page
              </Button>
              <Button variant="ghost" onClick={() => router.push('/login')}>
                🔐 Login Page
              </Button>
              <Button variant="ghost" onClick={() => router.push('/register')}>
                📝 Register Page
              </Button>
              <Button variant="ghost" onClick={() => router.push('/courses')}>
                📚 Course Catalog
              </Button>
              <Button variant="ghost" onClick={() => router.push('/courses/demo-course')}>
                📖 Course Detail
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* UI Testing Pages */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>✅ Pages yang Bisa Ditest Tanpa Supabase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => router.push('/student/courses/demo-course/learn')}
              >
                🎥 Course Player (Video UI)
              </Button>
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => router.push('/student/quiz/demo-quiz')}
              >
                📝 Quiz Interface (Timer, Questions)
              </Button>
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => router.push('/student/quiz/demo-quiz/result/demo-attempt')}
              >
                📊 Quiz Results (Score Display)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-8 p-6 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
          <h3 className="font-semibold text-ink-900 mb-2">💡 Tips:</h3>
          <ul className="space-y-2 text-sm text-ink-600">
            <li>✅ Pages dengan ✅ bisa ditest full tanpa Supabase</li>
            <li>⚠️ Pages lain akan show loading atau error (normal, karena belum ada data)</li>
            <li>🎨 Semua UI components bisa dilihat (buttons, cards, forms, etc)</li>
            <li>🌙 Test dark mode dengan toggle di navbar</li>
            <li>📱 Test responsive dengan resize browser</li>
          </ul>
        </div>

        {/* Setup Supabase Info */}
        <div className="mt-6 p-6 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
          <h3 className="font-semibold text-ink-900 mb-2">🚀 Untuk Full Testing:</h3>
          <ol className="space-y-2 text-sm text-ink-600 list-decimal list-inside">
            <li>Buat project di <a href="https://supabase.com" target="_blank" className="text-brand-500 hover:underline">supabase.com</a></li>
            <li>Copy Project URL dan Anon Key</li>
            <li>Update <code className="bg-surface-2 px-2 py-1 rounded">frontend/.env.local</code></li>
            <li>Run migrations dari folder <code className="bg-surface-2 px-2 py-1 rounded">supabase/migrations/</code></li>
            <li>Refresh page dan login akan work!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
