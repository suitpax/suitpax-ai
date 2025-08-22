"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        caption: "flex justify-center pt-1 relative items-center",
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "inline-flex items-center justify-center rounded-md border border-gray-300"
        ),
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-500 rounded-md w-9 font-normal text-[11px]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative",
        day: cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent",
          "hover:border-gray-300 hover:bg-gray-50"
        ),
        day_selected:
          "border-gray-900 bg-gray-900 text-white hover:bg-gray-900 hover:text-white",
        day_today: "border border-gray-300",
        day_outside: "text-gray-300 opacity-50",
        ...classNames,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }

