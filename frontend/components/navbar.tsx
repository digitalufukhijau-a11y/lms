'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  Bell,
  Moon,
  Sun
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Profile {
  id: string
  full_name: string | null
  role: string | null
  [key: string]: any
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getUser()
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profile)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

  if (isAuthPage) return null

  return (
    <nav className="sticky top-0 z-10 bg-surface-0 border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-serif text-brand-500 font-normal">
              LMS Kampus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/courses" 
              className="text-sm text-ink-400 hover:text-ink-900 transition-colors"
            >
              Kursus
            </Link>
            {user && (
              <>
                <Link 
                  href="/my-courses" 
                  className="text-sm text-ink-400 hover:text-ink-900 transition-colors"
                >
                  Kursus Saya
                </Link>
                {profile?.role === 'instructor' && (
                  <Link 
                    href="/instructor" 
                    className="text-sm text-ink-400 hover:text-ink-900 transition-colors"
                  >
                    Dashboard Dosen
                  </Link>
                )}
                {profile?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="text-sm text-ink-400 hover:text-ink-900 transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-ink-600" />
                ) : (
                  <Moon className="w-5 h-5 text-ink-600" />
                )}
              </button>
            )}

            {user ? (
              <>
                {/* Notification Bell */}
                <button className="relative p-2 rounded-lg hover:bg-surface-2 transition-colors">
                  <Bell className="w-5 h-5 text-ink-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-500 text-white text-sm font-medium hover:bg-accent-500/90 transition-colors"
                  >
                    {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                  </button>

                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface-0 shadow-lg z-20">
                        <div className="p-3 border-b border-border">
                          <p className="font-medium text-ink-900">{profile?.full_name}</p>
                          <p className="text-sm text-ink-600">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-900 hover:bg-surface-2 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            Profil
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-900 hover:bg-surface-2 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            Pengaturan
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-500 hover:bg-surface-2 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="primary" asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-surface-2 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-ink-600" />
              ) : (
                <Menu className="w-5 h-5 text-ink-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <Link
              href="/courses"
              className="block px-3 py-2 rounded-lg text-ink-900 hover:bg-surface-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kursus
            </Link>
            {user ? (
              <>
                <Link
                  href="/my-courses"
                  className="block px-3 py-2 rounded-lg text-ink-900 hover:bg-surface-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kursus Saya
                </Link>
                {profile?.role === 'instructor' && (
                  <Link
                    href="/instructor"
                    className="block px-3 py-2 rounded-lg text-ink-900 hover:bg-surface-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard Dosen
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-lg text-ink-900 hover:bg-surface-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-lg text-danger-500 hover:bg-surface-2 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-lg text-ink-900 hover:bg-surface-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-lg text-ink-900 hover:bg-surface-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
