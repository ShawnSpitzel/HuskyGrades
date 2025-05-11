"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface EditSyllabusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradingScheme: Record<string, string>;
  onUpdate: (updatedScheme: Record<string, string>) => void;
}

export function EditSyllabusModal({
  open,
  onOpenChange,
  gradingScheme,
  onUpdate,
}: EditSyllabusModalProps) {
  const [scheme, setScheme] = useState<Record<string, string>>({
    ...gradingScheme,
    "A": "94-100",
    "A-": "90-93",
    "B+": "87-89",
    "B": "84-86",
    "B-": "80-83",
    "C+": "77-79",
    "C": "74-76",
    "C-": "70-73",
    "D+": "67-69",
    "D": "64-66",
    "D-": "60-63",
    "F": "0-59",
  });

  const handleGradeChange = (grade: string, value: string) => {
    setScheme((prev) => ({
      ...prev,
      [grade]: value,
    }));
  };

  const handleSave = () => {
    onUpdate(scheme);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Grading Scheme</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {Object.keys(scheme).map((grade) => (
            <div key={grade} className="grid grid-cols-2 gap-4 items-center">
              <Label>{grade}</Label>
              <Input
                type="text"
                value={scheme[grade]}
                onChange={(e) => handleGradeChange(grade, e.target.value)}
                placeholder="Enter range (e.g., 90-93)"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}