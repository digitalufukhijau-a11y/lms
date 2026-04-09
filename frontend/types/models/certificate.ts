import type { Tables } from '@/types/api'

/**
 * Base Certificate type from database
 */
export interface Certificate extends Tables<'certificates'> {
  // Database fields are inherited
}

/**
 * Certificate with course details
 */
export interface CertificateWithCourse extends Certificate {
  course: {
    title: string
    instructor: {
      full_name: string | null
    } | null
  } | null
}
