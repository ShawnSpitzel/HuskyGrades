"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassItem } from "../pages/student-dashboard";
import { useAuth } from "../contexts/AuthContext";

interface AddClassDialogProps {
  classInfo: ClassItem | null;
  classLength: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddClass: (classData: {
    name: string;
    professor: string;
    credits: number;
  }) => void;
}

export function AddClassDialog({
  classInfo,
  open,
  onOpenChange,
  onAddClass,
}: AddClassDialogProps) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const auth = useAuth();
  const userID = localStorage.getItem("userID")
    ? JSON.parse(localStorage.getItem("userID")!)
    : (() => {
        localStorage.setItem("userID", JSON.stringify(auth.userID));
        return auth.userID;
      })();
  const [formData, setFormData] = useState({
    credits: classInfo?.credits || null,
    className: classInfo?.className || "",
    professorName: classInfo?.professorName || "",
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addClass = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/addStudentClass/${userID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      onAddClass(result);
    } catch (error) {
      console.error("Error adding/updating student:", error);
    }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.className || !formData.professorName || !formData.credits) {
      alert("Please fill out all required fields.");
      return;
    }
    addClass();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Enter the details for your new class.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="className">Class Name</Label>
            <Input
              id="className"
              name="className"
              placeholder="e.g. Computer Science 101"
              defaultValue={formData.className}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="professorName">Professor Name</Label>
            <Input
              id="professorName"
              name="professorName"
              placeholder="e.g. Dr. Smith"
              defaultValue={formData.professorName}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="credits">Credits</Label>
            <Select
              onValueChange={(value) =>
                setFormData((prevData) => ({
                  ...prevData,
                  credits: Number(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select credits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Class</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
