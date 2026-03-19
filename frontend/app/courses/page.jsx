'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { CourseCard } from '@/components/course-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { EmptyState } from '@/components/empty-state'
import { Search, Filter, Grid3x3, List, BookOpen } from 'lucide-react'

export default function CoursesPage() {
  const supabase = createClient()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  async function fetchCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles!instructor_id(id, full_name, avatar_url),
          _count:enrollments(count)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(courses.map(c => c.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-surface-1">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-b from-brand-50/20 to-surface-1 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif text-ink-900 mb-3">
            Jelajahi Kursus
          </h1>
          <p className="text-ink-600 text-lg">
            Temukan kursus yang sesuai dengan minat dan kebutuhan Anda
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
            <Input
              placeholder="Cari kursus, instruktur, topik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="hidden md:flex"
            >
              <Filter className="h-5 w-5" />
            </Button>
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-brand-500 text-white' 
                    : 'bg-surface-0 text-ink-600 hover:bg-surface-2'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-brand-500 text-white' 
                    : 'bg-surface-0 text-ink-600 hover:bg-surface-2'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'brand' : 'neutral'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Semua' : category}
            </Badge>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="Tidak ada kursus ditemukan"
            description={
              search 
                ? 'Coba kata kunci lain atau ubah filter pencarian' 
                : 'Belum ada kursus tersedia saat ini'
            }
            action={
              search && (
                <Button variant="ghost" onClick={() => setSearch('')}>
                  Reset Pencarian
                </Button>
              )
            }
          />
        )}

        {/* Courses Grid/List */}
        {!loading && filteredCourses.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-ink-600">
                Menampilkan {filteredCourses.length} kursus
              </p>
            </div>
            
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
