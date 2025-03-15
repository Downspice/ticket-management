"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { updateUser } from "@/lib/actions"
import { validateInput } from "@/lib/utils"
import type { User } from "@/lib/types"

export default function EditUserPage() {
  const router = useRouter()
  const params=useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    roles: {
      admin: false,
      technician: false,
    },
    enabled: true,
  })
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    roles: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch user")
        const data = await response.json()
        setUser(data)

        // Initialize form data
        setFormData({
          fullName: data.fullName,
          email: data.email,
          roles: {
            admin: data.roles.includes("admin"),
            technician: data.roles.includes("technician"),
          },
          enabled: data.enabled,
        })
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [params.id])

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

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      enabled: checked,
    }))
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

      await updateUser(params.id, {
        fullName: formData.fullName,
        email: formData.email,
        roles: rolesArray,
        enabled: formData.enabled,
      })

      router.push("/users")
      router.refresh()
    } catch (error) {
      console.error("Failed to update user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <p>Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center">
          <p className="mb-4">User not found</p>
          <Button asChild>
            <Link href="/users">Back to Users</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
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

            <div className="space-y-2">
              <Label htmlFor="enabled">Status</Label>
              <div className="flex items-center space-x-2">
                <Switch id="enabled" checked={formData.enabled} onCheckedChange={handleStatusChange} />
                <Label htmlFor="enabled" className="font-normal">
                  {formData.enabled ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/users")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

