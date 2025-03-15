"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { createTicket } from "../../lib/actions"
import { validateInput } from "../../lib/utils"
import type { User } from "../../lib/types"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../../lib/utils"

export default function CreateTicket() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    priority: "",
    assignedToId: "",
    assignedToName:"",
    description: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    priority: "",
    assignedToId: "",
    assignedToName:"",
    description: "",
  })
  const [technicians, setTechnicians] = useState<User[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetch("/api/users?role=technician")
        if (!response.ok) throw new Error("Failed to fetch technicians")
        const data = await response.json()
        setTechnicians(data)
      } catch (error) {
        console.error("Error fetching technicians:", error)
      }
    }

    fetchTechnicians()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string,name2?: string, value2?: string) => {
    setFormData((prev) => ({ ...prev, [name]: value,[name2]: value2 }))

    // Clear error when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: validateInput(formData.name),
      priority: formData.priority ? "" : "Priority is required",
      assignedToId: formData.assignedToId ? "" : "Assignee is required",
      description: validateInput(formData.description),
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true) 
    try {
      await createTicket(formData)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Failed to create ticket:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Ticket</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Ticket Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger id="priority" className={errors.priority ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedToId">
                Assigned To <span className="text-red-500">*</span>
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between ${errors.assignedToId ? "border-red-500" : ""}`}
                  >
                    {formData.assignedToId
                      ? technicians.find((user) => user.id === formData.assignedToId)?.fullName || "Select technician"
                      : "Select technician"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search technician..." />
                    <CommandList>
                      <CommandEmpty>No technician found.</CommandEmpty>
                      <CommandGroup>
                        {technicians.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.fullName}
                            onSelect={() => {
                              handleSelectChange("assignedToId", user.id,"assignedToName",user.fullName)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.assignedToId === user.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {user.fullName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.assignedToId && <p className="text-red-500 text-sm">{errors.assignedToId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

