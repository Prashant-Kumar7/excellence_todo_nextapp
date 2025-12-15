"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Trash2, Edit, Calendar } from "lucide-react"
import { Todo } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { toast } from "sonner"
import EditTodoDialog from "@/components/dashboard/edit-todo-dialog"

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const supabase = createClient()

  const handleToggleComplete = async () => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", todo.id)

    if (error) {
      toast.error("Failed to update todo")
    } else {
      toast.success("Todo updated")
      router.refresh()
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const { error } = await supabase.from("todos").delete().eq("id", todo.id)

    if (error) {
      toast.error("Failed to delete todo")
    } else {
      toast.success("Todo deleted")
      router.refresh()
    }
    setIsDeleting(false)
  }

  return (
    <>
      <Card className={todo.completed ? "opacity-60" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggleComplete}
                className="mt-1"
              />
              <div className="flex-1">
                <CardTitle
                  className={
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }
                >
                  {todo.title}
                </CardTitle>
                {todo.description && (
                  <CardDescription className="mt-1">
                    {todo.description}
                  </CardDescription>
                )}
                {todo.due_date && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(todo.due_date), "MMM dd, yyyy")}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this todo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <EditTodoDialog
        todo={todo}
        open={isEditing}
        onOpenChange={setIsEditing}
      />
    </>
  )
}

