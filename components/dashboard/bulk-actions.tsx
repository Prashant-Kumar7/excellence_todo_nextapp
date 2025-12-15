"use client"

import { Trash2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
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

interface BulkActionsProps {
  selectedIds: string[]
  onBulkDelete: () => void
  onBulkComplete: () => void
  onBulkUncomplete: () => void
}

export function BulkActions({
  selectedIds,
  onBulkDelete,
  onBulkComplete,
  onBulkUncomplete,
}: BulkActionsProps) {
  if (selectedIds.length === 0) return null

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
      <span className="text-sm font-medium">
        {selectedIds.length} todo{selectedIds.length > 1 ? "s" : ""} selected
      </span>
      <div className="ml-auto flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkComplete}
          className="gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark Complete
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkUncomplete}
          className="gap-2"
        >
          <XCircle className="h-4 w-4" />
          Mark Incomplete
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selectedIds.length} todos?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                {selectedIds.length} todo{selectedIds.length > 1 ? "s" : ""}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onBulkDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

