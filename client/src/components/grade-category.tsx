"use client"

import { useEffect, useState } from "react"
import { Edit, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GradeItemModal } from "../modals/grade-item-modal"
import type { GradeItem, CategoryItem } from "../pages/student-dashboard"
import {OptimisticAverageScore,  CategoryGradeAverage, PessimisticAverageScore } from "@/utils/grade-calculations"

interface GradeCategoryProps {
  categoryInfo: CategoryItem
  onUpdate: (updatedCategory: CategoryItem) => void;
  onDelete: () => void;
}

export function GradeCategory({ categoryInfo, onUpdate, onDelete}: GradeCategoryProps) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GradeItem | null>(null);
  const [bulkAddCount, setBulkAddCount] = useState<string>("");
  const [currentBulkCount, setCurrentBulkCount] = useState<number>(0); // Track current bulk items
  const [categoryDetails, setCategoryDetails] = useState({
    id: categoryInfo?.id || 0,
    weight: categoryInfo?.weight || 0,
    title: categoryInfo?.title || "",
    average: categoryInfo?.average || 0,
    predictedOptimistic: categoryInfo?.predictedOptimistic || 0,
    predictedPessimistic: categoryInfo?.predictedPessimistic || 0,
    items: categoryInfo?.items || [],
  });
  
  useEffect(() => {
    setCategoryDetails({
      id: categoryInfo?.id || 0,
      weight: categoryInfo?.weight || 0,
      title: categoryInfo?.title || "",
      average: categoryInfo?.average || 0,
      predictedOptimistic: categoryInfo?.predictedOptimistic || 0,
      predictedPessimistic: categoryInfo?.predictedPessimistic || 0,
      items: categoryInfo?.items || [],
    });
  }, [categoryInfo]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const newCategoryDetails = {
      ...categoryDetails,
      [name]: value,
    };
    setCategoryDetails(newCategoryDetails);
    onUpdate(newCategoryDetails);
  };
  
  const handleDeleteCategory = async (id: number | undefined) => {
    if (id !== null) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/deleteGradeCategory/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
    onDelete();
  }

  const fetchGradeItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gradesById/${categoryInfo.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const updatedCategory = {
        ...categoryDetails,
        items: data,
      };
      setCategoryDetails(updatedCategory);
      const newAverage = CategoryGradeAverage(updatedCategory);
      const optimisticCategory = OptimisticAverageScore(updatedCategory);
      const pessimisticCategory = PessimisticAverageScore(updatedCategory);
      const optimisticAverage = CategoryGradeAverage(optimisticCategory)
      const pessimisticAverage = CategoryGradeAverage(pessimisticCategory);
      const finalUpdatedCategory = {
        ...updatedCategory,
        average: newAverage,
        predictedOptimistic: optimisticAverage,
        predictedPessimistic: pessimisticAverage
      };
      setCategoryDetails(finalUpdatedCategory);
      onUpdate(finalUpdatedCategory);
    } catch (error) {
      console.error("Error fetching grade items:", error);
    }
  };
  
  useEffect(() => {
    fetchGradeItems();
  }, []);

  const handleEditItem = (item: GradeItem) => {
    setSelectedItem(item);
    setEditMode(true);
  };
// Function to handle adding singular item
  // const handleAddItem = () => {
  //   const newItem: GradeItem = {
  //     name: "",
  //     grade: 0,
  //   };
  //   setSelectedItem(newItem);
  //   setEditMode(false);
  // };

  const updateGradeItems = async (updatedItems: GradeItem[]) => {
    try {
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
      
      await fetchGradeItems(); // Refresh the data
    } catch (error) {
      console.error("Error updating grade items:", error);
      throw error;
    }
  };

  const handleBulkAdd = async () => {
    const newCount = parseInt(bulkAddCount);
    if (isNaN(newCount) || newCount < 0 || newCount > 50) {
      alert("Please enter a valid number between 0 and 50");
      return;
    }

    try {
      const currentItems = [...categoryDetails.items];
      const bulkItems = currentItems.filter(item => 
        item.name.startsWith(`${categoryInfo.title} `) && 
        /\d+$/.test(item.name)
      );
      const nonBulkItems = currentItems.filter(item => 
        !(item.name.startsWith(`${categoryInfo.title} `) && /\d+$/.test(item.name))
      );
      const newBulkItems: GradeItem[] = [];
      for (let i = 1; i <= newCount; i++) {
        const existingItem = bulkItems.find(item => 
          item.name === `${categoryInfo.title} ${i}`
        );
        
        if (existingItem) {
          newBulkItems.push(existingItem);
        } else {
          newBulkItems.push({
            name: `${categoryInfo.title} ${i}`,
            grade: -1,
          });
        }
      }
      const finalItems = [...nonBulkItems, ...newBulkItems];
      await updateGradeItems(finalItems);
      setCurrentBulkCount(newCount);
      
    } catch (error) {
      console.error("Error updating bulk items:", error);
      alert("Error updating items. Please try again.");
    }
  };

  // Initialize bulk count when component loads
  useEffect(() => {
    if (categoryDetails.items.length > 0) {
      const bulkItems = categoryDetails.items.filter(item => 
        item.name.startsWith(`${categoryInfo.title} `) && 
        /\d+$/.test(item.name)
      );
      if (bulkItems.length > 0 && currentBulkCount === 0) {
        setCurrentBulkCount(bulkItems.length);
        setBulkAddCount(bulkItems.length.toString());
      }
    }
  }, [categoryDetails.items, categoryInfo.title, currentBulkCount]);

  useEffect(() => {
    onUpdate(categoryDetails);
  }, [categoryDetails.average, categoryDetails.items.length]);

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
          <CardTitle className="text-lg">{categoryInfo.title}</CardTitle>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
          <span>Weight:</span>
          <Input
            id="weight"
            name="weight"
            className="w-16"
            value={categoryDetails.weight ?? 0}
            onChange={handleChange}
          />
          <span>%</span>
          </div>
          <div>Average: {categoryDetails.average}%</div>
        </div>
        </div>
        <div>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500"
          onClick={() => handleDeleteCategory(categoryInfo.id)}
        >
          <Trash2 className="flex items-center h-4 w-4" />
        </Button>
        </div>
      </div>
      {isOpen && (
        <div className="mt-4 space-y-2 pl-7">
        {categoryDetails.items.map((item, index) => (
          <div
          key={index}
          className="flex items-center justify-between rounded-md border p-3"
          >
          <div className="font-medium">{item.name}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Score:</span>
            <span className="font-medium">
              {item.grade === -1 ? "N/A" : `${item.grade}%`}
            </span>
            </div>
            <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleEditItem(item)}
            >
            <Edit className="h-4 w-4" />
            </Button>
          </div>
          </div>
        ))}
        
        {/* Bulk add section */}
        <div className="flex items-center gap-2 mt-4 p-3 rounded-md border bg-gray-50">
          <span className="text-sm font-medium">Number of {categoryInfo.title}:</span>
          <Input
            type="number"
            min="0"
            max="50"
            className="w-20"
            value={bulkAddCount}
            onChange={(e) => setBulkAddCount(e.target.value)}
            placeholder="0"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkAdd}
            disabled={!bulkAddCount || parseInt(bulkAddCount) < 0}
          >
            {currentBulkCount === 0 ? 'Add' : 'Update to'} {bulkAddCount || "0"} Items
          </Button>
        </div>
        
        {/* Add single item button */}
        {/* <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => handleAddItem()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {categoryInfo.title}
        </Button> */}
        </div>
      )}
      </CardHeader>

      {/* Edit Item Modal */}
      {selectedItem && (
      <GradeItemModal
        open={!!selectedItem}
        editMode={editMode}
        onOpenChange={(open: any) => !open && setSelectedItem(null)}
        categoryInfo={categoryInfo}
        itemInfo={selectedItem}
        onUpdate={fetchGradeItems}
        onDelete={fetchGradeItems}
      />
      )}
    </Card>
  );
}