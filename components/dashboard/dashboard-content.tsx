"use client"

import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TodoList from "@/components/dashboard/todo-list"
import CreateTodoDialog from "@/components/dashboard/create-todo-dialog"
import { TodoFilters } from "@/components/dashboard/todo-filters"
import { BulkActions } from "@/components/dashboard/bulk-actions"
import { Todo } from "@/lib/types/database"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface DashboardContentProps {
  todayTodos: Todo[]
  completedTodos: Todo[]
  pendingTodos: Todo[]
}

type SortOption =
  | "created_desc"
  | "created_asc"
  | "due_date_asc"
  | "due_date_desc"
  | "title_asc"
  | "title_desc"
  | "priority_desc"
  | "priority_asc"

export default function DashboardContent({
  todayTodos,
  completedTodos,
  pendingTodos,
}: DashboardContentProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("today")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("created_desc")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const currentTodos =
    activeTab === "today"
      ? todayTodos
      : activeTab === "completed"
      ? completedTodos
      : pendingTodos

  const availableCategories = useMemo(() => {
    const allTodos = [...todayTodos, ...completedTodos, ...pendingTodos]
    const categories = new Set<string>()
    allTodos.forEach((todo) => {
      if (todo.category) categories.add(todo.category)
    })
    return Array.from(categories).sort()
  }, [todayTodos, completedTodos, pendingTodos])

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = currentTodos.filter((todo) => {
      const matchesSearch =
        searchQuery === "" ||
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === "all" || todo.category === categoryFilter

      const matchesPriority =
        priorityFilter === "all" || todo.priority === priorityFilter

      return matchesSearch && matchesCategory && matchesPriority
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "created_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "created_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "due_date_asc":
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        case "due_date_desc":
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
        case "title_asc":
          return a.title.localeCompare(b.title)
        case "title_desc":
          return b.title.localeCompare(a.title)
        case "priority_desc":
          const priorityOrder = { high: 3, medium: 2, low: 1, null: 0 }
          return (
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
          )
        case "priority_asc":
          const priorityOrderAsc = { high: 3, medium: 2, low: 1, null: 0 }
          return (
            (priorityOrderAsc[a.priority as keyof typeof priorityOrderAsc] || 0) -
            (priorityOrderAsc[b.priority as keyof typeof priorityOrderAsc] || 0)
          )
        default:
          return 0
      }
    })

    return filtered
  }, [currentTodos, searchQuery, categoryFilter, priorityFilter, sortBy])

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return

    const { error } = await supabase
      .from("todos")
      .delete()
      .in("id", Array.from(selectedIds))

    if (error) {
      toast.error("Failed to delete todos")
    } else {
      toast.success(`Deleted ${selectedIds.size} todo(s)`)
      setSelectedIds(new Set())
      router.refresh()
    }
  }

  const handleBulkComplete = async () => {
    if (selectedIds.size === 0) return

    const { error } = await supabase
      .from("todos")
      .update({ completed: true })
      .in("id", Array.from(selectedIds))

    if (error) {
      toast.error("Failed to update todos")
    } else {
      toast.success(`Marked ${selectedIds.size} todo(s) as complete`)
      setSelectedIds(new Set())
      router.refresh()
    }
  }

  const handleBulkUncomplete = async () => {
    if (selectedIds.size === 0) return

    const { error } = await supabase
      .from("todos")
      .update({ completed: false })
      .in("id", Array.from(selectedIds))

    if (error) {
      toast.error("Failed to update todos")
    } else {
      toast.success(`Marked ${selectedIds.size} todo(s) as incomplete`)
      setSelectedIds(new Set())
      router.refresh()
    }
  }

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

        <div className="mt-6 space-y-4">
          <TodoFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={(val) => setSortBy(val as SortOption)}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            availableCategories={availableCategories}
            selectedCount={selectedIds.size}
            onClearSelection={() => setSelectedIds(new Set())}
          />

          <BulkActions
            selectedIds={Array.from(selectedIds)}
            onBulkDelete={handleBulkDelete}
            onBulkComplete={handleBulkComplete}
            onBulkUncomplete={handleBulkUncomplete}
          />

          <TabsContent value="today" className="mt-0">
            <TodoList
              todos={filteredAndSortedTodos}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <TodoList
              todos={filteredAndSortedTodos}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <TodoList
              todos={filteredAndSortedTodos}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          </TabsContent>
        </div>
      </Tabs>

      <CreateTodoDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}

