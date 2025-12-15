"use client"

import { Todo } from "@/lib/types/database"
import TodoItem from "@/components/dashboard/todo-item"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TodoListProps {
  todos: Todo[]
  selectedIds?: Set<string>
  onSelectionChange?: (selectedIds: Set<string>) => void
}

export default function TodoList({
  todos,
  selectedIds,
  onSelectionChange,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No todos found</EmptyTitle>
          <EmptyDescription>
            Get started by creating a new todo
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectionChange && (
              <TableHead className="w-12">
                <span className="sr-only">Select for bulk operations</span>
                <span className="text-xs text-muted-foreground">Select</span>
              </TableHead>
            )}
            <TableHead className="w-12">
              <span className="sr-only">Mark as complete/incomplete</span>
              <span className="text-xs text-muted-foreground">Complete</span>
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isSelected={selectedIds?.has(todo.id)}
              onSelectChange={(selected) => {
                if (!onSelectionChange) return
                const newSelected = new Set(selectedIds || [])
                if (selected) {
                  newSelected.add(todo.id)
                } else {
                  newSelected.delete(todo.id)
                }
                onSelectionChange(newSelected)
              }}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

