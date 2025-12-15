import { redirect } from 'next/navigation'
import { requireAuth, getUserProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { Navbar } from '@/components/navbar'
import { format, startOfDay, endOfDay } from 'date-fns'

export default async function DashboardPage() {
  const session = await requireAuth()
  const profile = await getUserProfile(session.user.id)
  
  if (profile?.is_blocked) {
    redirect('/login')
  }

  const supabase = await createClient()
  
  // Fetch all todos for the user
  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching todos:', error)
  }

  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  const todayTodos = todos?.filter((todo) => {
    if (!todo.due_date) return false
    const dueDate = new Date(todo.due_date)
    return dueDate >= todayStart && dueDate <= todayEnd
  }) || []

  const completedTodos = todos?.filter((todo) => todo.completed) || []
  const pendingTodos = todos?.filter((todo) => !todo.completed) || []

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userEmail={session.user.email}
        userName={profile?.full_name || undefined}
        isAdmin={profile?.is_admin || false}
      />
      <div className="container mx-auto px-4 py-8">
        <DashboardContent
          todayTodos={todayTodos}
          completedTodos={completedTodos}
          pendingTodos={pendingTodos}
        />
      </div>
    </div>
  )
}

