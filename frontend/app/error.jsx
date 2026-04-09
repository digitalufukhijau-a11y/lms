'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log error to console
    console.error('Application error:', error)
    
    // TODO: Send to error monitoring service (e.g., Sentry)
    // logErrorToService(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-ink-900 mb-4">
          Terjadi Kesalahan
        </h1>
        <p className="text-ink-600 mb-6">
          Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang menangani masalah ini.
        </p>
        {error.digest && (
          <p className="text-sm text-ink-400 mb-6">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            Coba Lagi
          </Button>
          <Button variant="ghost" asChild>
            <a href="/">Kembali ke Beranda</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
