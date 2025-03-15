"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import type { Ticket } from "../lib/types"
import { validateInput } from "../lib/utils"

interface SolvedModalProps {
  ticket: Ticket
  onSubmit: (cause: string, solution: string) => void
  onClose: () => void
}

export default function SolvedModal({ ticket, onSubmit, onClose }: SolvedModalProps) {
  const [cause, setCause] = useState("")
  const [solution, setSolution] = useState("")
  const [errors, setErrors] = useState({ cause: "", solution: "" })

  const handleSubmit = () => {
    // Validate inputs
    const causeError = validateInput(cause)
    const solutionError = validateInput(solution)

    if (causeError || solutionError) {
      setErrors({
        cause: causeError || "",
        solution: solutionError || "",
      })
      return
    }

    onSubmit(cause, solution)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Ticket as Solved</DialogTitle>
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
            <Label htmlFor="cause">
              Cause <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cause"
              value={cause}
              onChange={(e) => {
                setCause(e.target.value)
                if (errors.cause) setErrors({ ...errors, cause: "" })
              }}
              placeholder="What caused this issue?"
              className={errors.cause ? "border-red-500" : ""}
            />
            {errors.cause && <p className="text-red-500 text-sm">{errors.cause}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">
              Solution <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="solution"
              value={solution}
              onChange={(e) => {
                setSolution(e.target.value)
                if (errors.solution) setErrors({ ...errors, solution: "" })
              }}
              placeholder="How was this issue resolved?"
              className={errors.solution ? "border-red-500" : ""}
            />
            {errors.solution && <p className="text-red-500 text-sm">{errors.solution}</p>}
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

