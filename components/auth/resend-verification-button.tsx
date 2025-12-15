"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ResendVerificationButtonProps {
  email?: string
}

export default function ResendVerificationButton({
  email,
}: ResendVerificationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Verification email sent! Please check your inbox.")
    } catch (error) {
      toast.error("Failed to send verification email")
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return null
  }

  return (
    <Button
      onClick={handleResend}
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? "Sending..." : "Resend Verification Email"}
    </Button>
  )
}

