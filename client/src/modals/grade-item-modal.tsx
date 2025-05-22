"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryItem, GradeItem } from "../pages/student-dashboard";
import { Trash2 } from "lucide-react";

interface GradeItemModalProps {
  open: boolean;
  editMode: boolean;
  onOpenChange: (open: boolean) => void;
  categoryInfo: CategoryItem;
  itemInfo: GradeItem;
  onUpdate: (updatedItem: GradeItem) => void;
  onDelete: () => void;
}

export function GradeItemModal({
  open,
  editMode,
  onOpenChange,
  categoryInfo,
  itemInfo,
  onUpdate,
  onDelete,
}: GradeItemModalProps) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [categoryDetails, setCategoryDetails] = useState({
    id: categoryInfo?.id || 0,
    weight: categoryInfo?.weight || 0,
    title: categoryInfo?.title || "",
    average: categoryInfo?.average || 0,
    items: categoryInfo?.items || [],
  });
  
  const [itemDetails, setItemDetails] = useState<GradeItem>({
    id: itemInfo?.id,
    name: itemInfo?.name || "",
    grade: itemInfo?.grade || 0,
  });
  useEffect(() => {
    setItemDetails({
      id: itemInfo?.id,
      name: itemInfo?.name || "",
      grade: itemInfo?.grade || 0,
    });
    
    setCategoryDetails({
      id: categoryInfo?.id || 0,
      weight: categoryInfo?.weight || 0,
      title: categoryInfo?.title || "",
      average: categoryInfo?.average || 0,
      items: categoryInfo?.items || [],
    });
  }, [itemInfo, categoryInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const processedValue = name === 'grade' ? parseFloat(value) || 0 : value;
    
    const newItemDetails = {
      ...itemDetails,
      [name]: processedValue,
    };
    
    setItemDetails(newItemDetails);
  };
  
  const handleDeleteGradeItem = async (id: number | undefined) => {
    if (id !== null && id !== undefined) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/deleteGrade/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        onDelete();
        onOpenChange(false);
      } catch (error) {
        console.error("Error deleting grade:", error);
      }
    } else {
      onOpenChange(false);
    }
  };
  
  const updateGradeItem = async () => {
    try {
      const updatedItems = categoryDetails.items.map(item => 
        item.id === itemDetails.id ? itemDetails : item
      );
      if (!updatedItems.some(item => item.id === itemDetails.id)) {
        updatedItems.push(itemDetails);
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/grades/${categoryInfo.id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItems),
        }
      );
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const result = await response.json();
      onUpdate(result);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating grade item:", error);
    }
  };
  
  const addGradeItem = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/addGradeItem/${categoryInfo.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemDetails),
        }
      );
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const result = await response.json();
      onUpdate(result);
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding grade item:", error);
    }
  };
  
  const handleSubmit = () => {
    if (!itemDetails.name || itemDetails.grade === undefined) {
      alert("Please fill in all fields");
      return;
    }
    
    if (editMode) {
      updateGradeItem();
    } else {
      addGradeItem();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enter in one of your {categoryInfo.title}</DialogTitle>
          <DialogDescription>
            {editMode ? `Edit` : `Add a new`} {categoryInfo.title} entry.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={itemDetails.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="grade">Score (%)</Label>
            <Input
              id="grade"
              name="grade"
              type="number"
              min="0"
              max="100"
              value={itemDetails.grade}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              size="sm"
              className="text-red-500"
              onClick={() => handleDeleteGradeItem(itemDetails.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}