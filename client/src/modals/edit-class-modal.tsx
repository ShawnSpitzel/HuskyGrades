"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ClassItem, CategoryItem } from "../pages/student-dashboard.tsx";
import { GradeCategory } from "../components/grade-category.tsx";
import { EditSyllabusModal } from "./edit-syllabus-modal.tsx";
import { GradeCalculations } from "@/utils/grade-calculations.tsx";

interface EditClassModalProps {
  classLength: number;
  classInfo: ClassItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateClass?: (classData: ClassItem) => void;
}

export function EditClassModal({
  classInfo,
  open,
  onOpenChange,
  onUpdateClass = () => {},
}: EditClassModalProps) {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [classDetails, setClassDetails] = useState({
    id: classInfo?.id,
    credits: classInfo?.credits || 0,
    className: classInfo?.className || "",
    categories: classInfo?.categories || [],
    professorName: classInfo?.professorName || "",
    currentGrade: classInfo?.currentGrade || 0,
    predictedOptimistic: classInfo?.predictedOptimistic || 0,
    predictedPessimistic: classInfo?.predictedPessimistic || 0,
    gradingScheme: classInfo?.gradingScheme || {},
  });
  const [newCategory, setNewCategory] = useState<CategoryItem>({
    title: "",
    average: 0,
    weight: 0,
    items: [],
  });
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setClassDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleGradeChange = () => {
    const grades = GradeCalculations(classDetails);
    classInfo.currentGrade = grades;
    console.log("Class Grade: ", classInfo.currentGrade);
  };
  const handleUpdateCategory = (updatedCategory: CategoryItem) => {
    setClassDetails((prevData) => ({
      ...prevData,
      categories: prevData.categories.map((cat) =>
        cat.title === updatedCategory.title ? updatedCategory : cat
      ),
    }));
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/gradeCategory/${classInfo.id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClassDetails((prev) => ({
        ...prev,
        categories: data,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const updateClass = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/classes/${classInfo.id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(classDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      onUpdateClass(result);
    } catch (error) {
      console.error("Error adding/updating student:", error);
    }
  };

  const updateCategories = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/gradeCategory/${classInfo.id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(classDetails.categories),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error adding/updating student:", error);
    }
  };
  const addGradeCategory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/addGradeCategory/${classInfo.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setClassDetails((prev) => ({
        ...prev,
        categories: [...prev.categories, result],
      }));
      setNewCategory({ title: "", average: 0, weight: 0, items: [] });
      setIsAddCategoryModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating student:", error);
    }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      !classDetails.className ||
      !classDetails.professorName ||
      !classDetails.credits
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    handleGradeChange();
    updateClass();
    updateCategories();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Class Content: {classInfo.className}</DialogTitle>
          <DialogDescription>
            Manage class details and graded components.
          </DialogDescription>
        </DialogHeader>

        {/* Class Details Section */}
        <div className="space-y-4 py-4">
          <h3 className="text-lg font-medium">Class Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                name="className"
                defaultValue={classDetails.className}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="professorName">Professor Name</Label>
              <Input
                id="professorName"
                name="professorName"
                defaultValue={classDetails.professorName}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                min={0}
                max={12}
                defaultValue={classDetails.credits || ""}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Edit Syllabus</Label>
              <Button
                variant="outline"
                onClick={() => setIsSyllabusModalOpen(true)}
              >
                Edit Syllabus
              </Button>
            </div>
          </div>
        </div>

        {/* Class Grade Categories */}
        <Separator className="my-4" />
        <div className="space-y-4">
          {classDetails.categories.map((category, index) => (
            <GradeCategory
              key={index}
              title={category.title}
              weight={category.weight}
              average={category.average}
              items={category.items}
              onUpdate={handleUpdateCategory}
            />
          ))}
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAddCategoryModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>

            {/* Add Grade Category */}
            {isAddCategoryModalOpen && (
              <Dialog
                open={isAddCategoryModalOpen}
                onOpenChange={setIsAddCategoryModalOpen}
              >
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new grade category.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="categoryTitle">Title</Label>
                      <Input
                        id="categoryTitle"
                        name="title"
                        value={newCategory.title}
                        onChange={(e) =>
                          setNewCategory((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        placeholder="Enter a weight for the assignment type!"
                        min={0}
                        max={100}
                        value={newCategory.weight}
                        onChange={(e) =>
                          setNewCategory((prev) => ({
                            ...prev,
                            weight: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="flex justify-end mt-4">
                    <Button onClick={addGradeCategory}>Add Category</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>

      <EditSyllabusModal
        open={isSyllabusModalOpen}
        onOpenChange={setIsSyllabusModalOpen}
        gradingScheme={classDetails.gradingScheme}
        onUpdate={(updatedScheme: Record<string, any>) => {
          setClassDetails((prev) => ({
            ...prev,
            gradingScheme: updatedScheme,
          }));
        }}
      />
    </Dialog>
  );
}
