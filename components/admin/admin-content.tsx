"use client"

import { UserProfile } from "@/lib/types/database"
import UsersTable from "@/components/admin/users-table"
import { Shield } from "lucide-react"

interface AdminContentProps {
  users: UserProfile[]
  currentAdminId: string
}

export default function AdminContent({ users, currentAdminId }: AdminContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage users and their permissions
          </p>
        </div>
      </div>

      <UsersTable users={users} currentAdminId={currentAdminId} />
    </div>
  )
}

