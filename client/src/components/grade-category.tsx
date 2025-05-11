"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EditAssignmentModal } from "../modals/edit-item-modal"
import type { GradeItem, CategoryItem } from "../pages/student-dashboard"

interface GradeCategoryProps {
  title: string;
  weight: number;
  average: number;
  items: GradeItem[];
  onUpdate: (updatedCategory: CategoryItem) => void;
}

export function GradeCategory({ title, weight, average, items, onUpdate }: GradeCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GradeItem | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<CategoryItem>({
    weight: weight || 0,
    title: title || "",
    average: average || 0,
    items: items || [],
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    onUpdate(newFormData);
  };

  const handleUpdateCategory = (updatedData: Partial<CategoryItem>) => {
    if (onUpdate) {
      onUpdate({
        title,
        weight,
        average,
        items,
        ...updatedData,
      });
    }
  };

  const handleEditItem = (item: GradeItem, index: number) => {
    setEditingItem(item);
    setEditingItemIndex(index);
  };

  const handleAddItem = () => {
    const newItem: GradeItem = {
      id: Date.now(), // Use a unique ID
      name: "",
      grade: 0,
      weight: 0,
    };
    setEditingItem(newItem);
    setEditingItemIndex(null); // No index since this is a new item
  };

  const handleUpdateItem = (updatedItem: GradeItem) => {
    const updatedItems = [...items];
    if (editingItemIndex !== null) {
      // Update existing item
      updatedItems[editingItemIndex] = updatedItem;
    } else {
      // Add new item
      updatedItems.push(updatedItem);
    }
    handleUpdateCategory({
      items: updatedItems,
    });
    setEditingItem(null);
    setEditingItemIndex(null);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-7 w-7"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Weight:</span>
                <Input
                  id="weight"
                  name="weight"
                  className="w-16"
                  value={formData.weight ?? 0}
                  onChange={handleChange}
                />
                <span>%</span>
              </div>
              <div>Average: {average}%</div>
            </div>
          </div>
          <div className="flex gap-2"></div>
        </div>
        {isOpen && (
          <div className="mt-4 space-y-2 pl-7">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="font-medium">{item.name}</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Weight:</span>
                    <span className="font-medium">{item.weight}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Score:</span>
                    <span className="font-medium">{item.grade}%</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditItem(item, index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {/* Add item button */}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => handleAddItem()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add {title}
            </Button>
          </div>
        )}
      </CardHeader>

      {/* Edit Item Modal */}
      {editingItem && (
        <EditAssignmentModal
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          item={editingItem}
          categoryTitle={title}
          categoryWeight={weight}
          onUpdate={handleUpdateItem}
        />
      )}
    </Card>
  );
}
