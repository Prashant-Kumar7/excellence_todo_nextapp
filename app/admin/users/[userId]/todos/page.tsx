import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import UserTodosContent from '@/components/admin/user-todos-content'
import { format, startOfDay, endOfDay } from 'date-fns'

export default async function UserTodosPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { session, profile } = await requireAdmin()
  const supabase = await createClient()
  const { userId } = await params

  // Fetch user profile
  const { data: userProfile, error: userError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (userError || !userProfile) {
    redirect('/admin')
  }

  // Fetch all todos for the user
  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
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
        userName={profile.full_name || undefined}
        isAdmin={true}
      />
      <div className="container mx-auto px-4 py-8">
        <UserTodosContent
          userProfile={userProfile}
          todayTodos={todayTodos}
          completedTodos={completedTodos}
          pendingTodos={pendingTodos}
        />
      </div>
    </div>
  )
}

