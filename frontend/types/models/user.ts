import type { Tables } from '@/types/api'

export type UserRole = 'student' | 'instructor' | 'admin'

/**
 * Base User type from database (profiles table)
 */
export interface User extends Tables<'profiles'> {
  // Database fields are inherited from Tables<'profiles'>
  // Add computed or derived fields here if needed
}

/**
 * Extended User type with profile statistics
 */
export interface UserProfile extends User {
  enrollmentCount?: number
  coursesCreated?: number
}

/**
 * Authenticated user type for auth context
 */
export interface AuthUser {
  id: string
  email: string
  role: UserRole
  full_name: string | null
}
