import type { Tables } from '@/types/api'

/**
 * Base Course type from database
 */
export interface Course extends Tables<'courses'> {
  // Database fields are inherited from Tables<'courses'>
}

/**
 * Course with instructor information
 */
export interface CourseWithInstructor extends Course {
  instructor: {
    id: string
    full_name: string | null
    email: string
  }
}

/**
 * Course with statistics and metadata
 */
export interface CourseWithStats extends Course {
  enrollmentCount: number
  averageRating: number | null
  totalLessons: number
  totalDuration: number
}

/**
 * Form data for creating/updating courses
 */
export interface CourseFormData {
  title: string
  slug: string
  description: string
  price: number
  thumbnail_url?: string
  is_published: boolean
}
