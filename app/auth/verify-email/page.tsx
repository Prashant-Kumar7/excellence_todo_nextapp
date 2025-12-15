import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import ResendVerificationButton from '@/components/auth/resend-verification-button'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string; type?: string }
}) {
  const supabase = await createClient()

  // Handle email verification callback
  if (searchParams.token && searchParams.type === 'signup') {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: searchParams.token,
      type: 'signup',
    })

    if (!error) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Email Verified!</CardTitle>
              <CardDescription>
                Your email has been successfully verified. You can now access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  // Check if user is already verified
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.email_confirmed_at) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Please check your email inbox and click the verification link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<div>Loading...</div>}>
            <ResendVerificationButton email={user?.email} />
          </Suspense>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

