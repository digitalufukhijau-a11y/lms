import type { Tables } from '@/types/api'

/**
 * Base Enrollment type from database
 */
export interface Enrollment extends Tables<'enrollments'> {
  // Database fields are inherited
}

/**
 * Enrollment with course details
 */
export interface EnrollmentWithCourse extends Enrollment {
  course: {
    id: string
    title: string
    slug: string
    thumbnail_url: string | null
    description: string | null
    instructor: {
      full_name: string | null
    } | null
  }
}

/**
 * Enrollment progress information
 */
export interface EnrollmentProgress {
  enrollment_id: string
  completed_lessons: number
  total_lessons: number
  progress_percentage: number
  last_accessed_at: string | null
}
