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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DateTimePicker } from "@/components/dashboard/date-time-picker"
import { toast } from "sonner"
import { format } from "date-fns"

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional().or(z.literal("")),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || "",
      dueDate: todo.due_date
        ? format(new Date(todo.due_date), "yyyy-MM-dd")
        : "",
      dueTime: "",
      category: todo.category || "",
      priority: (todo.priority as "low" | "medium" | "high") || "none",
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
        dueTime: "",
        category: todo.category || "",
        priority: (todo.priority as "low" | "medium" | "high") || "",
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
          category: data.category || null,
          priority: data.priority || null,
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
              <Label>Due Date & Time</Label>
              <DateTimePicker
                date={watch("dueDate")}
                time={watch("dueTime")}
                onDateChange={(date) => setValue("dueDate", date)}
                onTimeChange={(time) => setValue("dueTime", time)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Work, Personal, Shopping"
                {...register("category")}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch("priority") || ""}
                onValueChange={(value) => setValue("priority", value === "" ? undefined : (value as any))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
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

