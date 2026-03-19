import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Users, Clock, BookOpen } from 'lucide-react'

export function CourseCard({ course, enrolled = false }) {
  const {
    slug,
    title,
    description,
    thumbnail_url,
    instructor,
    price,
    _count,
    category,
    rating,
    duration_minutes,
    progress,
    is_new,
  } = course

  const studentCount = _count?.enrollments || 0
  const chapterCount = _count?.chapters || 0
  const durationHours = duration_minutes ? Math.floor(duration_minutes / 60) : 0
  const durationText = durationHours > 0 ? `${durationHours}j` : duration_minutes ? `${duration_minutes}m` : null

  return (
    <Link href={`/courses/${slug}`}>
      <Card className="group overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-surface-2 flex items-center justify-center overflow-hidden">
          {thumbnail_url ? (
            <Image
              src={thumbnail_url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-brand-50 to-surface-2">
              <BookOpen className="h-16 w-16 text-brand-500/40" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {is_new && <Badge variant="brand">BARU</Badge>}
            {price === 0 && <Badge variant="brand">GRATIS</Badge>}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Category */}
          {category && (
            <div className="text-xs font-medium uppercase tracking-wide text-brand-500">
              {category}
            </div>
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold text-ink-900 line-clamp-2 group-hover:text-brand-500 transition-colors">
            {title}
          </h3>

          {/* Instructor */}
          {instructor?.full_name && (
            <p className="text-xs text-ink-600">
              {instructor.full_name}
            </p>
          )}

          {/* Meta Row */}
          <div className="flex items-center gap-3 text-xs text-ink-600 mt-auto">
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-warn-500 text-warn-500" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            {studentCount > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{studentCount}</span>
              </div>
            )}
            {durationText && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{durationText}</span>
              </div>
            )}
            {!durationText && chapterCount > 0 && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{chapterCount} bab</span>
              </div>
            )}
          </div>

          {/* Progress Bar (only if enrolled) */}
          {enrolled && progress !== undefined && (
            <div className="space-y-1 pt-2">
              <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-ink-600 text-right">
                {progress}% selesai
              </div>
            </div>
          )}

          {/* Price */}
          {!enrolled && price > 0 && (
            <div className="text-sm font-semibold text-brand-500 pt-2">
              Rp {price.toLocaleString('id-ID')}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
