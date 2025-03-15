"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Ticket } from "@/lib/types"

interface TicketCardProps {
  ticket: Ticket
}

export default function TicketCard({ ticket }: TicketCardProps) {
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
    <Link href={`/tickets/${ticket.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-2">
          <div
            className={`w-4 h-4 rounded-full ${getPriorityColor(ticket.priority)}`}
            aria-label={`Priority: ${ticket.priority}`}
          />
          <CardTitle className="text-sm font-medium">#{ticket.ticketNumber}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <h3 className="font-medium mb-1">{ticket.name}</h3>
          <p className="text-sm text-gray-500">Assigned to: {ticket.assignedToName|| "Unassigned"}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

