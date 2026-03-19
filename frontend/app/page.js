import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { BookOpen, Users, Award, TrendingUp, Video, FileText, MessageSquare } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-1">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-surface-1 to-brand-50/20 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="brand" className="mb-4">
              Platform Pembelajaran Kampus
            </Badge>
            
            <h1 className="text-5xl font-serif text-ink-900 leading-tight">
              Belajar Lebih Mudah, Kapan Saja, Di Mana Saja
            </h1>
            
            <p className="text-lg text-ink-600 leading-relaxed">
              Sistem manajemen pembelajaran modern untuk mahasiswa dan dosen. 
              Akses materi kuliah, kerjakan tugas, dan ikuti kelas online dalam satu platform.
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/register">Daftar Gratis</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/courses">Jelajahi Kursus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-surface-0 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-serif text-brand-500 mb-2">1,200+</div>
              <div className="text-sm text-ink-600">Mahasiswa Aktif</div>
            </div>
            <div>
              <div className="text-4xl font-serif text-brand-500 mb-2">50+</div>
              <div className="text-sm text-ink-600">Kursus Tersedia</div>
            </div>
            <div>
              <div className="text-4xl font-serif text-brand-500 mb-2">30+</div>
              <div className="text-sm text-ink-600">Dosen Berpengalaman</div>
            </div>
            <div>
              <div className="text-4xl font-serif text-brand-500 mb-2">95%</div>
              <div className="text-sm text-ink-600">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-surface-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-ink-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              Platform lengkap dengan berbagai fitur untuk mendukung pembelajaran online yang efektif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-surface-0 rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink-900 mb-2">
                Video Pembelajaran
              </h3>
              <p className="text-sm text-ink-600">
                Akses video materi kuliah berkualitas tinggi dengan subtitle dan kontrol kecepatan
              </p>
            </div>

            <div className="bg-surface-0 rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink-900 mb-2">
                Kuis & Tugas
              </h3>
              <p className="text-sm text-ink-600">
                Kerjakan kuis dan tugas online dengan sistem penilaian otomatis
              </p>
            </div>

            <div className="bg-surface-0 rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink-900 mb-2">
                Live Class
              </h3>
              <p className="text-sm text-ink-600">
                Ikuti kelas online secara real-time dengan fitur video conference
              </p>
            </div>

            <div className="bg-surface-0 rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink-900 mb-2">
                Forum Diskusi
              </h3>
              <p className="text-sm text-ink-600">
                Berdiskusi dengan dosen dan teman sekelas dalam forum kursus
              </p>
            </div>

            <div className="bg-surface-0 rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink-900 mb-2">
                Sertifikat Digital
              </h3>
              <p className="text-sm text-ink-600">
                Dapatkan sertifikat digital setelah menyelesaikan kursus
              </p>
            </div>

            <div className="bg-surface-0 rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-sm text-ink-600">
                Pantau progress belajar dengan dashboard yang informatif
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif text-ink-900 mb-4">
            Siap Memulai Perjalanan Belajar?
          </h2>
          <p className="text-ink-600 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan mahasiswa yang sudah merasakan kemudahan belajar online
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/register">Daftar Sekarang</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-0 border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif text-brand-500 mb-4">LMS Kampus</h3>
              <p className="text-sm text-ink-600">
                Platform pembelajaran online untuk kampus modern
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-ink-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-ink-600">
                <li><Link href="/courses" className="hover:text-brand-500">Kursus</Link></li>
                <li><Link href="/instructors" className="hover:text-brand-500">Instruktur</Link></li>
                <li><Link href="/about" className="hover:text-brand-500">Tentang</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-ink-900 mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-ink-600">
                <li><Link href="/help" className="hover:text-brand-500">Pusat Bantuan</Link></li>
                <li><Link href="/faq" className="hover:text-brand-500">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-brand-500">Kontak</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-ink-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-ink-600">
                <li><Link href="/privacy" className="hover:text-brand-500">Privasi</Link></li>
                <li><Link href="/terms" className="hover:text-brand-500">Syarat & Ketentuan</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-ink-600">
            © 2026 LMS Kampus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
