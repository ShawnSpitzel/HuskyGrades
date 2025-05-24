import { CategoryItem, ClassItem} from '@/pages/student-dashboard';

const DEFAULT_GRADING_SCHEME: Record<string, string> = {
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
    "F": "1-59",
  };
export function GradeCalculations(classInfo: ClassItem) {
    const calculatedClassGrade = classInfo.categories.reduce(
        (sum, cat) => sum + (cat.average * (cat.weight / 100)), 0);
    return calculatedClassGrade;

}
export function OptimisticGradeCalculations(classInfo: ClassItem) {
    const calculatedClassGrade = classInfo.categories.reduce(
        (sum, cat) => sum + (cat.predictedOptimistic * (cat.weight / 100)), 0);
    return calculatedClassGrade;

}
export function PessimisticGradeCalculations(classInfo: ClassItem) {
    const calculatedClassGrade = classInfo.categories.reduce(
        (sum, cat) => sum + (cat.predictedPessimistic * (cat.weight / 100)), 0);
    return calculatedClassGrade;

}
export function LetterGradeCalculations(classInfo: ClassItem): string {
    const currentGrade = Math.round(Number(classInfo.currentGrade));
    if (isNaN(currentGrade)) {
        console.warn("Current grade is not available")
      return "N/A";
    }
    const gradingSchemeToUse = DEFAULT_GRADING_SCHEME;
    const sortedGrades = Object.keys(gradingSchemeToUse).sort((a, b) => {
      const getLowerBound = (gradeKey: string) => {
        const range = gradingSchemeToUse[gradeKey];
        const [lower] = range.split('-').map(Number);
        return !(lower) ? -Infinity : lower;
      };
      return getLowerBound(b) - getLowerBound(a);
    });
    for (const letterGrade of sortedGrades) {
      const rangeString = gradingSchemeToUse[letterGrade];
      if (rangeString) {
        const [lowerBoundStr, upperBoundStr] = rangeString.split('-');
        const lowerBound = Number(lowerBoundStr);
        const upperBound = Number(upperBoundStr);
        if (!isNaN(lowerBound) && !isNaN(upperBound)) {
          if (currentGrade >= lowerBound && currentGrade <= upperBound) {
            return letterGrade;
          }
        } else {
          console.warn(`Invalid range format for grade "${letterGrade}": "${rangeString}"`);
        }
      }
    }
    console.warn("Error calculating grade")
    return "N/A";
  }
  export function OptimisticLetterGradeCalculations(classInfo: ClassItem): string {
    const currentGrade = Math.round(Number(classInfo.predictedOptimistic));
    if (isNaN(currentGrade)) {
        console.warn("Current grade is not available")
      return "N/A";
    }
    const gradingSchemeToUse = DEFAULT_GRADING_SCHEME;
    const sortedGrades = Object.keys(gradingSchemeToUse).sort((a, b) => {
      const getLowerBound = (gradeKey: string) => {
        const range = gradingSchemeToUse[gradeKey];
        const [lower] = range.split('-').map(Number);
        return !(lower) ? -Infinity : lower;
      };
      return getLowerBound(b) - getLowerBound(a);
    });
    for (const letterGrade of sortedGrades) {
      const rangeString = gradingSchemeToUse[letterGrade];
      if (rangeString) {
        const [lowerBoundStr, upperBoundStr] = rangeString.split('-');
        const lowerBound = Number(lowerBoundStr);
        const upperBound = Number(upperBoundStr);
        if (!isNaN(lowerBound) && !isNaN(upperBound)) {
          if (currentGrade >= lowerBound && currentGrade <= upperBound) {
            return letterGrade;
          }
        } else {
          console.warn(`Invalid range format for grade "${letterGrade}": "${rangeString}"`);
        }
      }
    }
    console.warn("Error calculating pessimistic letter grade")
    return "N/A";
  }
  export function PessimisticLetterGradeCalculations(classInfo: ClassItem): string {
    const currentGrade = Math.round(Number(classInfo.predictedPessimistic));
    if (isNaN(currentGrade)) {
        console.warn("Current grade is not available")
      return "N/A";
    }
    const gradingSchemeToUse = DEFAULT_GRADING_SCHEME;
    const sortedGrades = Object.keys(gradingSchemeToUse).sort((a, b) => {
      const getLowerBound = (gradeKey: string) => {
        const range = gradingSchemeToUse[gradeKey];
        const [lower] = range.split('-').map(Number);
        return !(lower) ? -Infinity : lower;
      };
      return getLowerBound(b) - getLowerBound(a);
    });
    for (const letterGrade of sortedGrades) {
      const rangeString = gradingSchemeToUse[letterGrade];
      if (rangeString) {
        const [lowerBoundStr, upperBoundStr] = rangeString.split('-');
        const lowerBound = Number(lowerBoundStr);
        const upperBound = Number(upperBoundStr);
        if (!isNaN(lowerBound) && !isNaN(upperBound)) {
          if (currentGrade >= lowerBound && currentGrade <= upperBound) {
            return letterGrade;
          }
        } else {
          console.warn(`Invalid range format for grade "${letterGrade}": "${rangeString}"`);
        }
      }
    }
    console.warn("Error calculating optimistic letter grade")
    return "N/A";
  }
  export function CategoryGradeAverage(categoryInfo: CategoryItem): number {
    let sumOfValidGrades = 0;
    let countOfValidGrades = 0;
    for (const item of categoryInfo.items) {
      if (item.grade !== -1) {
        sumOfValidGrades += item.grade;
        countOfValidGrades++;
      }
    }
    if (countOfValidGrades === 0) {
      return 0;
    }
  
    const calculatedCategoryAverage = sumOfValidGrades / countOfValidGrades;
    return Math.floor(calculatedCategoryAverage);
  }
  
export function GPACalculations(classes: ClassItem[]): number {
    let totalGradePoints = 0;
    let totalCredits = 0;
    const gradePointMap: Record<string, number> = {
      "A": 4.0,
      "A-": 3.7,
      "B+": 3.3,
      "B": 3.0,
      "B-": 2.7,
      "C+": 2.3,
      "C": 2.0,
      "C-": 1.7,
      "D+": 1.3,
      "D": 1.0,
      "D-": 0.7,
      "F": 0.0,
    };
    for (const classItem of classes) {
        const classCredits = Number(classItem.credits) || 0;
      if (classCredits > 0 && classItem.letterGrade) {
        const letterGrade = classItem.letterGrade;
        const gpaPoint = gradePointMap[letterGrade as keyof typeof gradePointMap] || 0.0;
        totalGradePoints += gpaPoint * classCredits;
        totalCredits += classCredits;
      }
      else {
        console.warn("Class Credits is either less than 0 or letterGrade doesn't exist")
      }
    }
    if (totalCredits == 0) {
        console.warn("Total Credits is 0")
        return 0.0;
    } else {
      return totalGradePoints / totalCredits;
    }
  }
  export function OptimisticGPACalculations(classes: ClassItem[]): number {
    let totalGradePoints = 0;
    let totalCredits = 0;
    const gradePointMap: Record<string, number> = {
      "A": 4.0,
      "A-": 3.7,
      "B+": 3.3,
      "B": 3.0,
      "B-": 2.7,
      "C+": 2.3,
      "C": 2.0,
      "C-": 1.7,
      "D+": 1.3,
      "D": 1.0,
      "D-": 0.7,
      "F": 0.0,
    };
    for (const classItem of classes) {
        const classCredits = Number(classItem.credits) || 0;
      if (classCredits > 0 && classItem.predictedOptimisticLetterGrade) {
        const letterGrade = classItem.predictedOptimisticLetterGrade;
        const gpaPoint = gradePointMap[letterGrade as keyof typeof gradePointMap] || 0.0;
        totalGradePoints += gpaPoint * classCredits;
        totalCredits += classCredits;
      }
      else {
      }
    }
    if (totalCredits == 0) {
        console.warn("Total Credits is 0")
        return 0.0;
    } else {
      return totalGradePoints / totalCredits;
    }
  }
  export function PessimisticGPACalculations(classes: ClassItem[]): number {
    let totalGradePoints = 0;
    let totalCredits = 0;
    const gradePointMap: Record<string, number> = {
      "A": 4.0,
      "A-": 3.7,
      "B+": 3.3,
      "B": 3.0,
      "B-": 2.7,
      "C+": 2.3,
      "C": 2.0,
      "C-": 1.7,
      "D+": 1.3,
      "D": 1.0,
      "D-": 0.7,
      "F": 0.0,
    };
    for (const classItem of classes) {
        const classCredits = Number(classItem.credits) || 0;
      if (classCredits > 0 && classItem.predictedPessimisticLetterGrade) {
        const letterGrade = classItem.predictedPessimisticLetterGrade;
        const gpaPoint = gradePointMap[letterGrade as keyof typeof gradePointMap] || 0.0;
        totalGradePoints += gpaPoint * classCredits;
        totalCredits += classCredits;
      }
      else {
        console.warn("Class Credits is either less than 0 or letterGrade doesn't exist")
      }
    }
    if (totalCredits == 0) {
        console.warn("Total Credits is 0")
        return 0.0;
    } else {
      return totalGradePoints / totalCredits;
    }
  }
  export function OptimisticAverageScore(category:CategoryItem){
    const newCategory = { ...category };
    newCategory.items = category.items.map(item => {
        if (item.grade === -1) {
            return { ...item, grade: 95 };
        }
        return { ...item }; 
    });
    return newCategory
  }
  export function PessimisticAverageScore(category:CategoryItem){
    const newCategory = { ...category };
    newCategory.items = category.items.map(item => {
        if (item.grade === -1) {
            return { ...item, grade: 45 };
        }
        return { ...item }; 
    });
    return newCategory
  }