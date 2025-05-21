"use client"

import { useEffect, useState } from "react"
import { GpaCards } from "../cards/gpa-cards"
import { WelcomeCard } from "../cards/welcome-card"
import { ClassesTable } from "../components/classes-table"
import { AccountMenu } from "../components/account-menu"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { GPACalculations, OptimisticGPACalculations, PessimisticGPACalculations } from "@/utils/grade-calculations"

export type ClassItem = {
  id: number
  className: string | ""
  professorName: string | ""
  credits: number | 0
  categories: CategoryItem[]
  currentGrade?: Number | 0
  letterGrade?: String | ""
  predictedOptimistic?: Number | 0
  predictedOptimisticLetterGrade?: String | ""
  predictedPessimistic?: Number | 0
  predictedPessimisticLetterGrade?: String | ""
  gradingScheme?: Record<string, any> | {
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
  }
}

export type GradeItem = {
  id?: number
  name: string | ""
  grade: number | -1
}

export type CategoryItem = {
  id?: number
  title: string | ""
  weight: number | 0
  average: number | 0
  predictedOptimistic: number | 0
  predictedPessimistic: number | 0
  items: GradeItem[]
}

export type UserProfile = {
  id: number
  email: string 
  password: string
  firstName: string 
  lastName: string
  major: string
  credits: number | 0
  classes: ClassItem[] | []
  GPA?: number | 0
  optimisticGPA?: number | 0
  pessimisticGPA?: number | 0
}
export default function StudentDashboard() {

  const { userID } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([])
  const navigate = useNavigate()

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 0,
    email: "johndoe@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    major: "Computer Science",
    credits: 62,
    classes: [],
    GPA: 0.0,
    optimisticGPA: 0.0,
    pessimisticGPA: 0.0,
  })
  const handleLogOut = () => {
    localStorage.removeItem("userID")
    alert("You have been logged out. Please refresh the page.")
  }
  const addClass = (
    newClass: Omit<ClassItem, "id" | "currentGrade" | "predictedOptimistic" | "predictedPessimistic">,
  ) => {
    const id = classes.length > 0 ? Math.max(...classes.map((c) => c.id)) + 1 : 1
    setClasses([
      ...classes,
      {
        ...newClass,
        id,
        currentGrade: 0,
        letterGrade: "",
        predictedOptimistic: 0,
        predictedOptimisticLetterGrade: "",
        predictedPessimistic: 0,
        predictedPessimisticLetterGrade: ""
      },
    ])
  }


  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile)
  }
  const loadUserData = async () => {
    if (!userID) {
      console.error("User ID is not available");
      return;
    }
    
    try {
      const profileResponse = await fetch(`http://localhost:8080/api/findStudent/${userID}`);
      if (!profileResponse.ok) {
        throw new Error("Failed to fetch student profile");
      }
      const profileData = await profileResponse.json();
      const classesResponse = await fetch(`http://localhost:8080/api/classes/${userID}`);
      if (!classesResponse.ok) {
        throw new Error("Failed to fetch classes");
      }
      const classesData = await classesResponse.json();
      setClasses(classesData);
      const calculatedGPA = GPACalculations(classesData);
      const calculatedOptimisticGPA = OptimisticGPACalculations(classesData);
      const calculatedPessimisticGPA = PessimisticGPACalculations(classesData);
      setUserProfile({
        ...profileData,
        GPA: calculatedGPA,
        optimisticGPA: calculatedOptimisticGPA,
        pessimisticGPA: calculatedPessimisticGPA
      });
      
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };
  useEffect(() => {
    loadUserData();
  }, [userID]);

  
  const handleUpdateClass = async (updatedClass:ClassItem) => {
  try{
    const response = await fetch(`http://localhost:8080/api/classes/${updatedClass.id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedClass),
    })

    if (!response.ok) {
      throw new Error("Failed to update class.")
    }
    const classesResponse = await fetch(`http://localhost:8080/api/classes/${userID}`);
      if (!classesResponse.ok) {
        throw new Error("Failed to fetch updated classes");
      }
      const updatedClasses = await classesResponse.json();
      setClasses(updatedClasses);
      const calculatedGPA = GPACalculations(updatedClasses);
      const calculatedOptimisticGPA = OptimisticGPACalculations(updatedClasses);
      const calculatedPessimisticGPA = PessimisticGPACalculations(updatedClasses);
      setUserProfile({
        ...userProfile,
        GPA: calculatedGPA,
        optimisticGPA: calculatedOptimisticGPA,
        pessimisticGPA: calculatedPessimisticGPA
      });
  } catch (error) {
    console.error("Error updating class:", error)
  }
  }

  useEffect(() => {
    if (userID && userID > 0) {
      localStorage.setItem("userID", JSON.stringify(userID));
    }
  }, [userID]);

  useEffect(() => {
  if (userID === 0 || userID === undefined || userID === null) {
    navigate("/login");
  }
}, [userID, navigate]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 md:px-6">

          <div className="text-2xl font-bold">
            <span style={{ color: "#000e2f" }}>Husky</span>
            <span className="text-gray-500">Grades</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <AccountMenu userProfile={userProfile} onUpdateProfile={updateUserProfile} onLogout = {handleLogOut} />
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <GpaCards currentGpa={userProfile.GPA || 0} optimisticGpa={userProfile.optimisticGPA || 0} pessimisticGpa={userProfile.pessimisticGPA || 0} />
          <WelcomeCard name={userProfile.firstName} />
          <ClassesTable
            classes={classes}
            onAddClass={addClass}
            onDeleteClass={() => loadUserData()}
            onUpdateClass={handleUpdateClass}
          />
        </div>
      </main>
    </div>
  )
}
