"use client"

import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface TodoFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  categoryFilter: string
  onCategoryChange: (category: string) => void
  priorityFilter: string
  onPriorityChange: (priority: string) => void
  availableCategories: string[]
  selectedCount: number
  onClearSelection: () => void
}

export function TodoFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  availableCategories,
  selectedCount,
  onClearSelection,
}: TodoFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Newest First</SelectItem>
              <SelectItem value="created_asc">Oldest First</SelectItem>
              <SelectItem value="due_date_asc">Due Date (Early)</SelectItem>
              <SelectItem value="due_date_desc">Due Date (Late)</SelectItem>
              <SelectItem value="title_asc">Title (A-Z)</SelectItem>
              <SelectItem value="title_desc">Title (Z-A)</SelectItem>
              <SelectItem value="priority_desc">Priority (High)</SelectItem>
              <SelectItem value="priority_asc">Priority (Low)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{selectedCount} selected</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-7"
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}

