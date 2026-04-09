import { PostgrestError } from '@supabase/supabase-js'

export class ApiError extends Error {
  code: string
  details?: string
  hint?: string

  constructor(message: string, code: string, details?: string, hint?: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
    this.hint = hint
  }

  static fromSupabaseError(error: PostgrestError): ApiError {
    return new ApiError(
      error.message,
      error.code,
      error.details,
      error.hint
    )
  }
}
