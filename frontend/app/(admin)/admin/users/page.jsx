'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { EmptyState } from '@/components/empty-state'
import { Search, Users, Edit, Trash2, UserPlus } from 'lucide-react'

export default function UsersManagementPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId, newRole) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      fetchUsers()
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Gagal mengubah role')
    }
  }

  async function handleDelete(userId) {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Gagal menghapus pengguna')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nim_nip?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-1">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-ink-900 mb-2">
            Manajemen Pengguna
          </h1>
          <p className="text-ink-600">
            Kelola pengguna dan role mereka
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pengguna..."
                  className="pl-10"
                />
              </div>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-48"
              >
                <option value="all">Semua Role</option>
                <option value="student">Mahasiswa</option>
                <option value="instructor">Instruktur</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Daftar Pengguna ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Tidak ada pengguna"
                description="Tidak ada pengguna yang sesuai dengan filter"
              />
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 border border-border rounded-lg hover:border-brand-500 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-medium text-brand-500">
                          {user.full_name?.charAt(0) || '?'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-ink-900 mb-1">
                          {user.full_name || 'Unknown'}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-ink-600">
                          {user.nim_nip && (
                            <span>NIM/NIP: {user.nim_nip}</span>
                          )}
                          <span>
                            Bergabung {new Date(user.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="w-32"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </Select>

                        <Badge 
                          variant={
                            user.role === 'admin' ? 'danger' :
                            user.role === 'instructor' ? 'accent' : 'brand'
                          }
                        >
                          {user.role}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
