"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SheetFilters({ trigger, children }: { trigger?: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || <Button variant="default" className="rounded-full h-9 px-4 bg-black text-white hover:bg-gray-900">Filters</Button>}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[90%] md:w-[420px] bg-white p-0">
        <SheetHeader className="px-6 py-4 border-b border-gray-200">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="p-6 overflow-y-auto h-full">
          <Accordion type="multiple" className="w-full">
            {children}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}

