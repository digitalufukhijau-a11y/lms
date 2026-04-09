'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function AuthError({
  error,
  reset,
}) {
  useEffect(() => {
    console.error('Auth area error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-ink-900 mb-4">
          Terjadi Kesalahan
        </h2>
        <p className="text-ink-600 mb-6">
          Maaf, terjadi kesalahan saat memuat halaman ini.
        </p>
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
