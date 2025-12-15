"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { UserProfile } from "@/lib/types/database"
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
import { DateTimePicker } from "@/components/dashboard/date-time-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "none"]).optional(),
  assignedUserId: z.string().min(1, "Please select a user"),
})

type TodoFormValues = z.infer<typeof todoSchema>

interface AssignTodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: UserProfile[]
}

export default function AssignTodoDialog({
  open,
  onOpenChange,
  users,
}: AssignTodoDialogProps) {
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
  })

  useEffect(() => {
    if (open) {
      reset({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        category: "",
        priority: "none",
        assignedUserId: "",
      })
    }
  }, [open, reset])

  const onSubmit = async (data: TodoFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("todos").insert({
        user_id: data.assignedUserId,
        title: data.title,
        description: data.description || null,
        due_date: data.dueDate || null,
        category: data.category || null,
        priority: (data.priority && data.priority !== "none") ? data.priority : null,
        completed: false,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      const assignedUser = users.find((u) => u.id === data.assignedUserId)
      toast.success(`Todo assigned to ${assignedUser?.full_name || assignedUser?.email || "user"} successfully`)
      reset()
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Assign Todo to User</DialogTitle>
            <DialogDescription>
              Create a todo and assign it to a user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assignedUserId">Assign To *</Label>
              <Select
                value={watch("assignedUserId")}
                onValueChange={(value) => setValue("assignedUserId", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((user) => !user.is_blocked)
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.email}
                        {user.is_admin && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Admin)
                          </span>
                        )}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.assignedUserId && (
                <p className="text-sm text-destructive">
                  {errors.assignedUserId.message}
                </p>
              )}
            </div>
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
                value={watch("priority") || "none"}
                onValueChange={(value) => setValue("priority", value === "none" ? undefined : (value as any))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
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
              {isLoading ? "Assigning..." : "Assign Todo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

