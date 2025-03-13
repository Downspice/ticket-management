"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Ticket } from "@/lib/types"
import { validateInput } from "@/lib/utils"

interface OnHoldModalProps {
  ticket: Ticket
  onSubmit: (holdReason: string) => void
  onClose: () => void
}

export default function OnHoldModal({ ticket, onSubmit, onClose }: OnHoldModalProps) {
  const [holdReason, setHoldReason] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    // Validate input
    const validationError = validateInput(holdReason)

    if (validationError) {
      setError(validationError)
      return
    }

    onSubmit(holdReason)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Put Ticket On Hold</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-semibold">
              #{ticket.ticketNumber}: {ticket.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {ticket.description.length > 100 ? `${ticket.description.substring(0, 100)}...` : ticket.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holdReason">
              Reason for Hold <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="holdReason"
              value={holdReason}
              onChange={(e) => {
                setHoldReason(e.target.value)
                if (error) setError("")
              }}
              placeholder="Why is this ticket being put on hold?"
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

