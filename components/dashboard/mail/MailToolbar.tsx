"use client"

import { Button } from "@/components/ui/button"

export default function MailToolbar({ selectedCount, onBulkAction, onCompose }: { selectedCount: number; onBulkAction: (a: string)=>void; onCompose: ()=>void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm text-gray-600">
        {selectedCount > 0 ? `${selectedCount} selected` : ""}
      </div>
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <>
            <Button size="sm" variant="outline" onClick={() => onBulkAction("read")}>Mark Read</Button>
            <Button size="sm" variant="outline" onClick={() => onBulkAction("archive")}>Archive</Button>
            <Button size="sm" variant="outline" onClick={() => onBulkAction("delete")}>Delete</Button>
          </>
        )}
        <Button className="bg-black text-white hover:bg-gray-800" onClick={onCompose}>Compose</Button>
      </div>
    </div>
  )
}