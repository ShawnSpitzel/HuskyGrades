"use client"

import type React from "react"

import { useState } from "react"
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
import type { GradeItem } from "../pages/student-dashboard"

interface EditAssignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: GradeItem
  categoryTitle: string
  categoryWeight: number
  onUpdate: (updatedItem: GradeItem) => void
}

export function EditAssignmentModal({
  open,
  onOpenChange,
  item,
  categoryTitle,
  categoryWeight,
  onUpdate,
}: EditAssignmentModalProps) {
  const [formData, setFormData] = useState<GradeItem>({ ...item })
  const [useCustomWeight, setUseCustomWeight] = useState(item.weight !== categoryWeight)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleWeightToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const useCustom = e.target.checked
    setUseCustomWeight(useCustom)

    if (!useCustom) {
      // Reset to category weight
      setFormData((prev) => ({
        ...prev,
        weight: categoryWeight,
      }))
    }
  }

  const handleSubmit = () => {
    onUpdate(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enter in one of your {categoryTitle}</DialogTitle>
          <DialogDescription>Add a new {categoryTitle} entry.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="grade">Score (%)</Label>
            <Input
              id="grade"
              name="grade"
              type="number"
              min="0"
              max="100"
              value={formData.grade}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="useCustomWeight" className="cursor-pointer">
                Use custom weight
              </Label>
              <Input
                id="useCustomWeight"
                type="checkbox"
                className="h-4 w-4"
                checked={useCustomWeight}
                onChange={handleWeightToggle}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight (%)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              disabled={!useCustomWeight}
            />
            {!useCustomWeight && (
              <p className="text-sm text-muted-foreground">Using default category weight of {categoryWeight}%</p>
            )}
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
