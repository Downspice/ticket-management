"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import TicketCard from "@/components/ticket-card"
import type { Ticket, TicketStatus } from "@/lib/types"

interface StatusColumnProps {
  title: string
  tickets: Ticket[]
  status: TicketStatus
  backgroundColor:string
}

export default function StatusColumn({ title, tickets, status,backgroundColor }: StatusColumnProps) {
  return (
    <div className={`${backgroundColor} rounded-lg p-4 h-full overflow-scroll`}>
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

