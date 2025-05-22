"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ClassItem } from "../pages/student-dashboard"
import { AddClassDialog } from "../modals/add-class-modal"
import { EditClassModal } from "../modals/edit-class-modal"

interface ClassesTableProps {
  classes: ClassItem[]
  onAddClass: (newClass: any) => void
  onDeleteClass?: () => void
  onUpdateClass?: (updatedClass: ClassItem) => void
}

export function ClassesTable({
  classes,
  onAddClass,
  onDeleteClass = () => {},
  onUpdateClass = () => {},
}: ClassesTableProps) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const [addClassOpen, setAddClassOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [classToDelete, setClassToDelete] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const classesPerPage = 5
  const totalPages = Math.ceil(classes.length / classesPerPage)
 const handleClassSelect = (cls: ClassItem | null) => {
    setSelectedClass(cls)
  
 }

  const handleConfirmDelete = async () => {
    if (classToDelete !== null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/deleteClass/${classToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
    } catch (error) {
      console.error("Error deleting student:", error)
    }
    onDeleteClass()
    setClassToDelete(null)
    setDeleteConfirmOpen(false)
    }
  }
  const handleDeleteClick = (classId: number) => {
    setClassToDelete(classId)
    setDeleteConfirmOpen(true)
  }

  const handleClassUpdate = (updatedClass: ClassItem) => {
    onUpdateClass(updatedClass)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Classes</CardTitle>
            <CardDescription>Manage your enrolled courses for this semester</CardDescription>
          </div>
          <AddClassDialog
            classInfo={selectedClass}
            classLength={classes.length}
            open={addClassOpen}
            onOpenChange={setAddClassOpen}
            onAddClass={(classData) => {
              onAddClass(classData)
              setAddClassOpen(false)
            }}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead className="text-center">Letter Grade</TableHead>
                <TableHead className="text-center">Current Grade</TableHead>
                <TableHead className="text-center">Optimistic</TableHead>
                <TableHead className="text-center">Pessimistic</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls: ClassItem) => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium py-5">{cls.className}</TableCell>
                <TableCell>{cls.professorName}</TableCell>
                <TableCell className="text-center">{cls.credits}</TableCell>
                <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className="font-bold"
                  style={{
                  backgroundColor: cls.letterGrade
                    ? cls.letterGrade === "A"
                    ? "rgba(16, 185, 129, 0.7)"
                    : cls.letterGrade === "A-"
                    ? "rgba(52, 211, 153, 0.7)" 
                    : cls.letterGrade === "B+"
                    ? "rgba(110, 231, 183, 0.7)"
                    : cls.letterGrade === "B"
                    ? "rgba(245, 158, 11, 0.7)"
                    : cls.letterGrade === "B-"
                    ? "rgba(251, 191, 36, 0.7)"
                    : cls.letterGrade === "C+"
                    ? "rgba(252, 211, 77, 0.7)"
                    : cls.letterGrade === "C"
                    ? "rgba(253, 230, 138, 0.7)"
                    : cls.letterGrade === "C-"
                    ? "rgba(254, 226, 226, 0.7)"
                    : "rgba(239, 68, 68, 0.7)"
                    : "transparent",
                  color: cls.letterGrade ? "#000" : "#6b7280", 
                  }}
                >
                  {cls.letterGrade || "N/A"}
                </Badge>
                </TableCell>
                <TableCell className="text-center">
                <Badge variant="outline" className="font-bold">
                  {cls.currentGrade ? Number(cls.currentGrade.toFixed(0)) : 0}
                </Badge>
                </TableCell>

                <TableCell className="text-center">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 font-bold">
                  {cls.predictedOptimistic ? Number(cls.predictedOptimistic) : 0}
                </Badge>
                </TableCell>
                <TableCell className="text-center">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 font-bold">
                  {cls.predictedPessimistic ? Number(cls.predictedPessimistic) : 0}
                </Badge>
                </TableCell>
                <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleClassSelect(cls)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Content
                  </Button>
                  <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleDeleteClick(cls.id)}
                  >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                  </Button>
                </div>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          <div className="flex flex-col items-center justify-center mt-4 gap-2">
            <span className="text-sm text-gray-500">
            Showing {classes.length} out of 12 classes
            </span>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <EditClassModal
          classInfo={selectedClass}
          classLength={classes.length}
          open={!!selectedClass}
          onOpenChange={(open) => !open && setSelectedClass(null)}
          onUpdateClass={handleClassUpdate}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this class and all associated grades. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
