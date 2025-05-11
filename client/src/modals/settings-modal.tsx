"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserProfile } from "../pages/student-dashboard"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userProfile: UserProfile
  onUpdateProfile: (profile: UserProfile) => void
}

export function SettingsModal({ open, onOpenChange, userProfile, onUpdateProfile }: SettingsModalProps) {
  const [formData, setFormData] = useState<UserProfile>(userProfile)
  
  useEffect(() => {
    setFormData(userProfile)
  }, [userProfile]
)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "credits" ? Number(value) : value,
    }))
  }

  const handleSubmit = () => {
    onUpdateProfile(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>Update your personal information and academic details.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="studentId">Email</Label>
              <Input className="bg-gray-100"id="studentId" name="studentId" value={formData.email} onChange={handleChange} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="major">Major</Label>
              <Input id="major" name="major" value={formData.major} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="credits">Credits</Label>
              <Input id="credits" name="credits" type="number" value={formData.credits} onChange={handleChange} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

