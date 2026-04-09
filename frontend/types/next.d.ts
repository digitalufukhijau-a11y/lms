import type { Database } from '@/lib/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

declare module 'next' {
  interface PageProps {
    params: Promise<Record<string, string>>
    searchParams: Promise<Record<string, string | string[] | undefined>>
  }
}
