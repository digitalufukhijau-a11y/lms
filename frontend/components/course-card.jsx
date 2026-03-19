import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, BookOpen } from 'lucide-react'

export function CourseCard({ course }) {
  const {
    slug,
    title,
    description,
    thumbnail_url,
    instructor,
    price,
    _count,
  } = course

  return (
    <Link href={`/courses/${slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {thumbnail_url ? (
            <Image
              src={thumbnail_url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-16 w-16 text-primary/40" />
            </div>
          )}
          {price === 0 && (
            <Badge className="absolute top-3 right-3 bg-green-500">
              Gratis
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {instructor?.full_name || 'Instructor'}
          </p>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{_count?.enrollments || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{_count?.chapters || 0} bab</span>
            </div>
          </div>
          {price > 0 && (
            <span className="font-semibold text-primary">
              Rp {price.toLocaleString('id-ID')}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
