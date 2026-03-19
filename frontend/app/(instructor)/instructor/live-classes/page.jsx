'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { EmptyState } from '@/components/empty-state'
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock,
  Users,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react'

export default function LiveClassesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState([])
  const [courses, setCourses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    scheduled_at: '',
    duration_minutes: 60,
    meeting_url: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, title')
        .eq('instructor_id', user.id)

      setCourses(coursesData || [])

      // Fetch live sessions
      const { data: sessionsData } = await supabase
        .from('live_sessions')
        .select(`
          *,
          course:courses(title),
          _count:attendances(count)
        `)
        .eq('instructor_id', user.id)
        .order('scheduled_at', { ascending: false })

      setSessions(sessionsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('live_sessions')
        .insert({
          ...formData,
          instructor_id: user.id,
          status: 'scheduled'
        })

      if (error) throw error

      setShowForm(false)
      setFormData({
        course_id: '',
        title: '',
        scheduled_at: '',
        duration_minutes: 60,
        meeting_url: ''
      })
      fetchData()
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Gagal membuat sesi live class')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus sesi ini?')) return

    try {
      const { error } = await supabase
        .from('live_sessions')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting session:', error)
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-ink-900 mb-2">
              Live Classes
            </h1>
            <p className="text-ink-600">
              Kelola sesi pembelajaran langsung
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Jadwalkan Sesi Baru
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Jadwalkan Live Class</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="course">Kursus *</Label>
                  <Select
                    id="course"
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    required
                  >
                    <option value="">Pilih kursus</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Judul Sesi *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Sesi Tanya Jawab Bab 1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduled_at">Tanggal & Waktu *</Label>
                    <Input
                      id="scheduled_at"
                      type="datetime-local"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Durasi (menit) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                      min="15"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meeting_url">Link Meeting</Label>
                  <Input
                    id="meeting_url"
                    value={formData.meeting_url}
                    onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Batal
                  </Button>
                  <Button type="submit" variant="primary">
                    Jadwalkan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Sesi</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <EmptyState
                icon={Video}
                title="Belum ada sesi"
                description="Jadwalkan sesi live class pertama Anda"
                action={
                  <Button variant="primary" onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Jadwalkan Sesi
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border border-border rounded-lg hover:border-brand-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                          <Video className="w-6 h-6 text-accent-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-ink-900 mb-1">
                            {session.title}
                          </h4>
                          <p className="text-sm text-ink-600">
                            {session.course?.title}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          session.status === 'completed' ? 'success' :
                          session.status === 'ongoing' ? 'info' :
                          session.status === 'cancelled' ? 'danger' : 'neutral'
                        }
                      >
                        {session.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-ink-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.scheduled_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(session.scheduled_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} ({session.duration_minutes} menit)
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {session._count?.attendances || 0} peserta
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {session.meeting_url && (
                        <Button variant="primary" size="sm" asChild>
                          <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Buka Meeting
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(session.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
