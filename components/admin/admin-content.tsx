"use client"

import { useState } from "react"
import { UserProfile } from "@/lib/types/database"
import UsersTable from "@/components/admin/users-table"
import AssignTodoDialog from "@/components/admin/assign-todo-dialog"
import { Shield, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminContentProps {
  users: UserProfile[]
  currentAdminId: string
}

export default function AdminContent({ users, currentAdminId }: AdminContentProps) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">
              Manage users and their permissions
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Assign Todo
        </Button>
      </div>

      <UsersTable users={users} currentAdminId={currentAdminId} />

      <AssignTodoDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        users={users}
      />
    </div>
  )
}

