"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Shield, ShieldOff, Ban, Trash2, User } from "lucide-react"
import { UserProfile } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UsersTableProps {
  users: UserProfile[]
}

export default function UsersTable({ users }: UsersTableProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("user_profiles")
      .update({ is_admin: !currentStatus })
      .eq("id", userId)

    if (error) {
      toast.error("Failed to update admin status")
    } else {
      toast.success(
        `User ${!currentStatus ? "promoted to" : "removed from"} admin`
      )
      router.refresh()
    }
  }

  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("user_profiles")
      .update({ is_blocked: !currentStatus })
      .eq("id", userId)

    if (error) {
      toast.error("Failed to update block status")
    } else {
      toast.success(`User ${!currentStatus ? "blocked" : "unblocked"}`)
      router.refresh()
    }
  }

  const handleDeleteUser = async (userId: string) => {
    // First delete all todos
    const { error: todosError } = await supabase
      .from("todos")
      .delete()
      .eq("user_id", userId)

    if (todosError) {
      toast.error("Failed to delete user todos")
      return
    }

    // Then delete user profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", userId)

    if (profileError) {
      toast.error("Failed to delete user")
    } else {
      toast.success("User deleted successfully")
      router.refresh()
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return email[0].toUpperCase()
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No users found
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(user.full_name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.full_name || "No name"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.is_blocked ? (
                  <Badge variant="destructive">Blocked</Badge>
                ) : (
                  <Badge variant="default">Active</Badge>
                )}
              </TableCell>
              <TableCell>
                {user.is_admin ? (
                  <Badge variant="secondary" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline">User</Badge>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(user.created_at), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                    title={user.is_admin ? "Remove admin" : "Make admin"}
                  >
                    {user.is_admin ? (
                      <ShieldOff className="h-4 w-4" />
                    ) : (
                      <Shield className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                    title={user.is_blocked ? "Unblock user" : "Block user"}
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the user and all their todos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

