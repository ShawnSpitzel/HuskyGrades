"use client"

import { useEffect, useState } from "react"
import { GpaCards } from "../cards/gpa-cards"
import { WelcomeCard } from "../cards/welcome-card"
import { ClassesTable } from "../components/classes-table"
import { AccountMenu } from "../components/account-menu"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export type ClassItem = {
  id: number
  className: string
  professorName: string
  credits: number
  categories: CategoryItem[]
  currentGrade?: Number
  predictedOptimistic?: Number
  predictedPessimistic?: Number
  gradingScheme?: Record<string, any>
}

export type GradeItem = {
  id?: number
  name: string
  grade: number
  weight: number
}

export type CategoryItem = {
  id?: number
  title: string
  weight: number
  average: number
  items: GradeItem[]
}

export type UserProfile = {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  major: string
  credits: number
  GPA?: number
  optimistiedGPA?: number
  pessimisticGPA?: number
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
    GPA: 0.0,
    optimistiedGPA: 0.0,
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
        predictedOptimistic: 0,
        predictedPessimistic: 0,
      },
    ])
  }


  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile)
  }
  const handleFetchStudent = async () => {
    if (!userID) {
      console.error("User ID is not available")
    } else{
    fetch(`http://localhost:8080/api/findStudent/${userID}`)
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data);
      })
      .catch((error) => {
        console.error("Error fetching student:", error);
      });
    };
  };
  useEffect(() => {
    handleFetchStudent();
  }, []);

  const handleFetchClasses = async () => {
    if (!userID) {
      console.error("User ID is not available")
    } else{
    fetch(`http://localhost:8080/api/classes/${userID}`)
      .then((response) => response.json())
      .then((data) => {
        setClasses(data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
    };
  };
  useEffect(() => {
    handleFetchClasses();
  }, []);

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
          {/* Add HuskyGrades to the left corner with styled text */}
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
          <GpaCards currentGpa={3.65} optimisticGpa={3.85} pessimisticGpa={3.42} />
          <WelcomeCard name={userProfile.firstName} />
          <ClassesTable
            classes={classes}
            onAddClass={addClass}
            onDeleteClass={handleFetchClasses}
            onUpdateClass={handleFetchClasses}
          />
        </div>
      </main>
    </div>
  )
}
