"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  date?: string
  time?: string
  onDateChange: (date: string | undefined) => void
  onTimeChange: (time: string) => void
  disabled?: boolean
}

export function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = date ? new Date(date) : undefined

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
              disabled={disabled}
            >
              {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  const dateStr = format(selectedDate, "yyyy-MM-dd")
                  onDateChange(dateStr)
                } else {
                  onDateChange(undefined)
                }
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time || ""}
          onChange={(e) => onTimeChange(e.target.value)}
          disabled={disabled}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-32"
        />
      </div>
    </div>
  )
}

