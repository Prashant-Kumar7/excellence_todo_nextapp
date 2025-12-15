import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import AdminContent from '@/components/admin/admin-content'
import { Navbar } from '@/components/navbar'

export default async function AdminPage() {
  const { session, profile } = await requireAdmin()

  const supabase = await createClient()
  
  // Fetch all user profiles
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userEmail={session.user.email}
        userName={profile.full_name || undefined}
        isAdmin={true}
      />
      <div className="container mx-auto px-4 py-8">
        <AdminContent users={users || []} />
      </div>
    </div>
  )
}

