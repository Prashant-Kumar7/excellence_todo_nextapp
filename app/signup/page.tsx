import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import SignupForm from '@/components/auth/signup-form'

export default async function SignupPage() {
  const session = await getSession()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">
            Sign up to get started with your todos
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}

