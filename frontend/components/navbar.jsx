'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  Bell,
  Search
} from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="hidden font-bold sm:inline-block text-xl">
              LMS Kampus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link 
              href="/courses" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Kursus
            </Link>
            {user && (
              <>
                <Link 
                  href="/my-courses" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Kursus Saya
                </Link>
                {profile?.role === 'instructor' && (
                  <Link 
                    href="/instructor" 
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Dashboard Dosen
                  </Link>
                )}
                {profile?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="rounded-full"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </Button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md border bg-background shadow-lg">
                      <div className="p-3 border-b">
                        <p className="font-medium">{profile?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                        >
                          <User className="h-4 w-4" />
                          Profil
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                        >
                          <Settings className="h-4 w-4" />
                          Pengaturan
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent text-destructive"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link
              href="/courses"
              className="block px-3 py-2 rounded-md hover:bg-accent"
            >
              Kursus
            </Link>
            {user ? (
              <>
                <Link
                  href="/my-courses"
                  className="block px-3 py-2 rounded-md hover:bg-accent"
                >
                  Kursus Saya
                </Link>
                {profile?.role === 'instructor' && (
                  <Link
                    href="/instructor"
                    className="block px-3 py-2 rounded-md hover:bg-accent"
                  >
                    Dashboard Dosen
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md hover:bg-accent"
                >
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-accent text-destructive"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md hover:bg-accent"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md hover:bg-accent"
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
