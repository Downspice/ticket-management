"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { createUser } from "@/lib/actions"
import { validateInput } from "@/lib/utils"

export default function CreateUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    roles: {
      admin: false,
      technician: false,
    },
  })
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    roles: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleRoleChange = (role: "admin" | "technician", checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: checked,
      },
    }))

    // Clear role error if at least one role is selected
    if (errors.roles && (checked || Object.values(formData.roles).some(Boolean))) {
      setErrors((prev) => ({ ...prev, roles: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      fullName: validateInput(formData.fullName),
      email: validateInput(formData.email),
      roles: !Object.values(formData.roles).some(Boolean) ? "At least one role must be selected" : "",
    }

    // Additional email validation
    if (!newErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
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
      // Convert roles object to array
      const rolesArray = Object.entries(formData.roles)
        .filter(([_, isSelected]) => isSelected)
        .map(([role]) => role)

      await createUser({
        fullName: formData.fullName,
        email: formData.email,
        roles: rolesArray,
      })

      router.push("/users")
      router.refresh()
    } catch (error) {
      console.error("Failed to create user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label>
                Roles <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin"
                    checked={formData.roles.admin}
                    onCheckedChange={(checked) => handleRoleChange("admin", checked as boolean)}
                  />
                  <Label htmlFor="admin" className="font-normal">
                    Admin
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="technician"
                    checked={formData.roles.technician}
                    onCheckedChange={(checked) => handleRoleChange("technician", checked as boolean)}
                  />
                  <Label htmlFor="technician" className="font-normal">
                    Technician
                  </Label>
                </div>
              </div>
              {errors.roles && <p className="text-red-500 text-sm">{errors.roles}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/users")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

