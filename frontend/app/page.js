import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Award, Video, CheckCircle, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Manajemen Kursus',
      description: 'Buat dan kelola kursus dengan struktur bab dan materi yang terorganisir'
    },
    {
      icon: CheckCircle,
      title: 'Kuis & Ujian',
      description: 'Sistem kuis online dengan penilaian otomatis dan timer'
    },
    {
      icon: Award,
      title: 'Sertifikat Digital',
      description: 'Generate sertifikat otomatis setelah menyelesaikan kursus'
    },
    {
      icon: Video,
      title: 'Live Class',
      description: 'Video conference terintegrasi untuk pembelajaran sinkron'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor kemajuan belajar dan kehadiran mahasiswa'
    },
    {
      icon: Users,
      title: 'Multi-role',
      description: 'Sistem role untuk student, instructor, dan admin'
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Platform Pembelajaran
              <span className="text-primary"> Digital Modern</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Sistem manajemen pembelajaran yang powerful dan mudah digunakan untuk institusi pendidikan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/courses">
                  Jelajahi Kursus
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">
                  Mulai Belajar Gratis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Kursus Tersedia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-sm text-muted-foreground">Mahasiswa Aktif</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Instruktur</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk pembelajaran online yang efektif
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Perjalanan Belajar Anda?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan mahasiswa yang sudah belajar di platform kami
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Daftar Sekarang - Gratis!
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">LMS Kampus</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Platform pembelajaran digital untuk institusi pendidikan modern
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/courses" className="hover:text-primary">Kursus</Link></li>
                <li><Link href="/about" className="hover:text-primary">Tentang</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Kontak</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Bantuan</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-primary">Support</Link></li>
                <li><Link href="/docs" className="hover:text-primary">Dokumentasi</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2026 LMS Kampus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
