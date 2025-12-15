"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TodoList from "@/components/dashboard/todo-list"
import CreateTodoDialog from "@/components/dashboard/create-todo-dialog"
import { Todo } from "@/lib/types/database"

interface DashboardContentProps {
  todayTodos: Todo[]
  completedTodos: Todo[]
  pendingTodos: Todo[]
}

export default function DashboardContent({
  todayTodos,
  completedTodos,
  pendingTodos,
}: DashboardContentProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your todos efficiently
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Todo
        </Button>
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

      <CreateTodoDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}

