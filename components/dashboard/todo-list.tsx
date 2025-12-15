"use client"

import { Todo } from "@/lib/types/database"
import TodoItem from "@/components/dashboard/todo-item"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

interface TodoListProps {
  todos: Todo[]
}

export default function TodoList({ todos }: TodoListProps) {
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
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}

