"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TodoList from "@/components/dashboard/todo-list"
import { UserProfile, Todo } from "@/lib/types/database"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserTodosContentProps {
  userProfile: UserProfile
  todayTodos: Todo[]
  completedTodos: Todo[]
  pendingTodos: Todo[]
}

export default function UserTodosContent({
  userProfile,
  todayTodos,
  completedTodos,
  pendingTodos,
}: UserTodosContentProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {getInitials(userProfile.full_name, userProfile.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              {userProfile.full_name || "User"}'s Todos
            </h1>
            <p className="text-muted-foreground mt-1">{userProfile.email}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="today">
            Today&apos;s Todos ({todayTodos.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTodos.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingTodos.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-6">
          <TodoList todos={todayTodos} />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <TodoList todos={completedTodos} />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <TodoList todos={pendingTodos} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

