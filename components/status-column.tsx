"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import TicketCard from "@/components/ticket-card"
import type { Ticket, TicketStatus } from "@/lib/types"

interface StatusColumnProps {
  title: string
  tickets: Ticket[]
  status: TicketStatus
}

export default function StatusColumn({ title, tickets, status }: StatusColumnProps) {
  const getColumnColor = (status: TicketStatus) => {
    switch (status) {
      case "Not Started":
        return "bg-blue-50"
      case "In Progress":
        return "bg-amber-50"
      case "On Hold":
        return "bg-purple-50"
      case "Solved":
        return "bg-green-50"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <div className={`rounded-lg p-4 ${getColumnColor(status)}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Droppable droppableId={status}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[500px]">
            {tickets.map((ticket, index) => (
              <Draggable key={ticket.id.toString()} draggableId={ticket.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                  >
                    <TicketCard ticket={ticket} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

