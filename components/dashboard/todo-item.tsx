"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Trash2, Edit } from "lucide-react"
import { Todo } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  TableCell,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import EditTodoDialog from "@/components/dashboard/edit-todo-dialog"

interface TodoItemProps {
  todo: Todo
  isSelected?: boolean
  onSelectChange?: (selected: boolean) => void
  readOnly?: boolean
}

export default function TodoItem({
  todo,
  isSelected = false,
  onSelectChange,
  readOnly = false,
}: TodoItemProps) {
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
      <TableRow
        className={`${todo.completed ? "opacity-60" : ""} ${
          isSelected ? "bg-muted/50" : ""
        }`}
      >
        {onSelectChange && !readOnly && (
          <TableCell className="w-12">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      onSelectChange(checked === true)
                    }
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Select todo for bulk operations"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select for bulk operations</p>
              </TooltipContent>
            </Tooltip>
          </TableCell>
        )}
        <TableCell className="w-12">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={readOnly ? undefined : handleToggleComplete}
                  disabled={readOnly}
                  aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{todo.completed ? "Mark as incomplete" : "Mark as complete"}</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>
        <TableCell className="min-w-[150px]">
          <div
            className={`font-medium ${
              todo.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.title}
          </div>
        </TableCell>
        <TableCell className="min-w-[200px]">
          <div className="text-sm text-muted-foreground max-w-md truncate">
            {todo.description || "-"}
          </div>
        </TableCell>
        <TableCell className="w-[120px]">
          {todo.category ? (
            <Badge variant="secondary">{todo.category}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
        <TableCell className="w-[100px]">
          {todo.priority ? (
            <Badge
              variant="outline"
              className={
                todo.priority === "high"
                  ? "border-red-500 text-red-700 dark:text-red-400"
                  : todo.priority === "medium"
                  ? "border-yellow-500 text-yellow-700 dark:text-yellow-400"
                  : "border-blue-500 text-blue-700 dark:text-blue-400"
              }
            >
              {todo.priority}
            </Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
        <TableCell className="w-[130px]">
          {todo.due_date ? (
            <span className="text-sm">
              {format(new Date(todo.due_date), "MMM dd, yyyy")}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </TableCell>
        <TableCell className="w-[120px] text-right">
          {readOnly ? (
            <span className="text-sm text-muted-foreground">View only</span>
          ) : (
            <div className="flex items-center justify-end gap-2">
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
          )}
        </TableCell>
      </TableRow>

      <EditTodoDialog
        todo={todo}
        open={isEditing}
        onOpenChange={setIsEditing}
      />
    </>
  )
}

