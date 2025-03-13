"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Ticket } from "@/lib/types"

interface TicketCardProps {
  ticket: Ticket
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowDetails(true)}>
        <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-2">
          <div
            className={`w-4 h-4 rounded-full ${getPriorityColor(ticket.priority)}`}
            aria-label={`Priority: ${ticket.priority}`}
          />
          <CardTitle className="text-sm font-medium">#{ticket.ticketNumber}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <h3 className="font-medium mb-1">{ticket.name}</h3>
          <p className="text-sm text-gray-500">Created by: {ticket.creator}</p>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ticket #{ticket.ticketNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${getPriorityColor(ticket.priority)}`} />
              <span className="font-medium">Priority: {ticket.priority}</span>
            </div>

            <div>
              <h3 className="font-semibold text-lg">{ticket.name}</h3>
              <p className="text-sm text-gray-500">Created by: {ticket.creator}</p>
            </div>

            <div>
              <h4 className="font-medium">Description:</h4>
              <p className="text-sm mt-1">{ticket.description}</p>
            </div>

            {ticket.status === "Solved" && (
              <>
                <div>
                  <h4 className="font-medium">Cause:</h4>
                  <p className="text-sm mt-1">{ticket.cause || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="font-medium">Solution:</h4>
                  <p className="text-sm mt-1">{ticket.solution || "Not specified"}</p>
                </div>
              </>
            )}

            {ticket.status === "On Hold" && (
              <div>
                <h4 className="font-medium">Reason for hold:</h4>
                <p className="text-sm mt-1">{ticket.holdReason || "Not specified"}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium">Current Status:</h4>
              <p className="text-sm mt-1">{ticket.status}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

