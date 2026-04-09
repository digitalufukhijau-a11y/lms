import type { Tables } from '@/types/api'

/**
 * Base Profile type from database
 */
export interface Profile extends Tables<'profiles'> {
  // Database fields are inherited
}

/**
 * Profile with statistics
 */
export interface ProfileWithStats extends Profile {
  coursesCompleted: number
  totalHours: number
  certificates: number
}

/**
 * Form data for updating profile
 */
export interface ProfileFormData {
  full_name: string
  nim_nip: string
  bio: string
  phone: string
}
