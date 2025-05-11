import { CategoryItem, ClassItem } from '@/pages/student-dashboard';
import React, { useState } from 'react';


interface ClassInfoProps {
    classInfo: ClassItem;
}
export function GradeCalculations(classInfo: ClassItem) {
    const calculatedClassGrade = classInfo.categories.reduce(
        (sum, cat) => sum + cat.average * (cat.weight / 100), 0);
    return calculatedClassGrade;

}
export function AverageChange(classInfo: ClassItem) {
    const [classDetails, setClassDetails] = useState({
        credits: classInfo?.credits || 0,
        className: classInfo?.className || "",
        categories: classInfo?.categories || [],
        professorName: classInfo?.professorName || "",
        currentGrade: classInfo?.currentGrade || 0,
        predictedOptimistic: classInfo?.predictedOptimistic || 0,
        predictedPessimistic: classInfo?.predictedPessimistic || 0,
        gradingScheme: classInfo?.gradingScheme || {},
      });

    const handleAverageChange = (updatedCategory: CategoryItem, index: number, newCategories: CategoryItem[]) => {
        const totalWeight = updatedCategory.items.reduce(
          (sum, item) => sum + item.weight,
          0 
        );
        const totalGrade = updatedCategory.items.reduce(
          (sum, item) => sum + item.grade * (item.weight / 100),
          0
        );
        const totalAverageGrade = (totalGrade / Math.max(1, totalWeight)) * 100;
        newCategories[index] = {
          ...updatedCategory,
          weight: totalWeight,
          average: Math.round(totalAverageGrade),
        };
  
    }

  return {
};
}