import Link from "next/link"
import { Button } from "@/components/ui/button"
import TicketBoard from "@/components/ticket-board"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ticket Management System</h1>
        <Link href="/create-ticket">
          <Button>Create New Ticket</Button>
        </Link>
      </div>
      <TicketBoard />
    </div>
  )
}

