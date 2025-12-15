"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { Todo } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { format } from "date-fns"

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
})

type TodoFormValues = z.infer<typeof todoSchema>

interface EditTodoDialogProps {
  todo: Todo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditTodoDialog({
  todo,
  open,
  onOpenChange,
}: EditTodoDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || "",
      dueDate: todo.due_date
        ? format(new Date(todo.due_date), "yyyy-MM-dd")
        : "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: todo.title,
        description: todo.description || "",
        dueDate: todo.due_date
          ? format(new Date(todo.due_date), "yyyy-MM-dd")
          : "",
      })
    }
  }, [open, todo, reset])

  const onSubmit = async (data: TodoFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("todos")
        .update({
          title: data.title,
          description: data.description || null,
          due_date: data.dueDate || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", todo.id)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Todo updated successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogDescription>Update your todo details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter todo title"
                {...register("title")}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter todo description (optional)"
                {...register("description")}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate")}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

