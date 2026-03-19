'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Save, Trash2 } from 'lucide-react'

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    slug: '',
    price: 0,
    passing_score: 70,
    status: 'draft',
    thumbnail_url: ''
  })

  useEffect(() => {
    fetchCourse()
  }, [params.id])

  async function fetchCourse() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setCourseData(data)
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', params.id)

      if (error) throw error

      alert('Kursus berhasil diperbarui!')
      router.push('/instructor')
    } catch (error) {
      console.error('Error updating course:', error)
      alert('Gagal memperbarui kursus')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Yakin ingin menghapus kursus ini?')) return

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      router.push('/instructor')
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Gagal menghapus kursus')
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-ink-900 mb-2">
            Edit Kursus
          </h1>
          <p className="text-ink-600">
            Perbarui informasi kursus Anda
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
                  onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={courseData.slug}
                  onChange={(e) => setCourseData({ ...courseData, slug: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={courseData.description || ''}
                  onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
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
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={courseData.status}
                  onChange={(e) => setCourseData({ ...courseData, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="thumbnail">URL Thumbnail</Label>
                <Input
                  id="thumbnail"
                  value={courseData.thumbnail_url || ''}
                  onChange={(e) => setCourseData({ ...courseData, thumbnail_url: e.target.value })}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="danger" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Kursus
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => router.back()}>
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
