'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function StudentError({
  error,
  reset,
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Student area error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-ink-900 mb-4">
          Terjadi Kesalahan di Area Siswa
        </h2>
        <p className="text-ink-600 mb-6">
          Maaf, terjadi kesalahan saat memuat halaman ini.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            Coba Lagi
          </Button>
          <Button variant="ghost" onClick={() => router.push('/student')}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
