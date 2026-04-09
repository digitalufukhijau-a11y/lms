/**
 * API types and database table types
 * This file provides type-safe access to database tables
 */

/**
 * Helper type to extract table row types from database schema
 * For now, we define types manually until Supabase types are generated
 */
export type Tables<T extends keyof DatabaseTables> = DatabaseTables[T]['Row']

/**
 * Database table definitions
 * These should eventually be replaced with generated Supabase types
 */
export interface DatabaseTables {
  profiles: {
    Row: {
      id: string
      email: string
      full_name: string | null
      role: 'student' | 'instructor' | 'admin'
      nim_nip: string | null
      bio: string | null
      phone: string | null
      created_at: string
      updated_at: string
    }
    Insert: Omit<DatabaseTables['profiles']['Row'], 'created_at' | 'updated_at'>
    Update: Partial<DatabaseTables['profiles']['Insert']>
  }
  courses: {
    Row: {
      id: string
      title: string
      slug: string
      description: string | null
      instructor_id: string
      thumbnail_url: string | null
      price: number
      is_published: boolean
      created_at: string
      updated_at: string
    }
    Insert: Omit<DatabaseTables['courses']['Row'], 'created_at' | 'updated_at'>
    Update: Partial<DatabaseTables['courses']['Insert']>
  }
  enrollments: {
    Row: {
      id: string
      student_id: string
      course_id: string
      progress: number
      enrolled_at: string
      completed_at: string | null
    }
    Insert: Omit<DatabaseTables['enrollments']['Row'], 'enrolled_at'>
    Update: Partial<DatabaseTables['enrollments']['Insert']>
  }
  certificates: {
    Row: {
      id: string
      student_id: string
      course_id: string
      certificate_number: string
      issued_at: string
    }
    Insert: Omit<DatabaseTables['certificates']['Row'], 'issued_at'>
    Update: Partial<DatabaseTables['certificates']['Insert']>
  }
  live_sessions: {
    Row: {
      id: string
      course_id: string
      title: string
      scheduled_at: string
      duration_minutes: number
      meeting_url: string | null
      created_at: string
    }
    Insert: Omit<DatabaseTables['live_sessions']['Row'], 'created_at'>
    Update: Partial<DatabaseTables['live_sessions']['Insert']>
  }
}

/**
 * API response wrapper types
 */
export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

/**
 * Pagination types
 */
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}
