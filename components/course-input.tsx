"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

interface CourseInputProps {
  onCoursesChange: (courses: string[]) => void
  initialCourses?: string[]
}

export function CourseInput({ onCoursesChange, initialCourses = [] }: CourseInputProps) {
  const [mounted, setMounted] = useState(false)
  const [courses, setCourses] = useState<string[]>(initialCourses)
  const [newCourse, setNewCourse] = useState("")
  const [error, setError] = useState("")

  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only call onCoursesChange when mounted
  useEffect(() => {
    if (mounted) {
      onCoursesChange(courses)
    }
  }, [courses, mounted, onCoursesChange])

  const handleAddCourse = () => {
    if (courses.length >= 10) {
      setError("Maximum 10 courses allowed")
      return
    }

    if (!newCourse.trim()) {
      setError("Course name cannot be empty")
      return
    }

    if (courses.includes(newCourse.trim())) {
      setError("This course has already been added")
      return
    }

    setCourses([...courses, newCourse.trim()])
    setNewCourse("")
    setError("")
  }

  const handleRemoveCourse = (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index)
    setCourses(newCourses)
    setError("")
  }

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          placeholder="Enter a physics course (e.g., Quantum Mechanics)"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddCourse()
            }
          }}
        />
        <Button
          onClick={handleAddCourse}
          className="bg-[#37b3a6] hover:bg-[#2a8a80] text-white"
          disabled={courses.length >= 10}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {courses.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {courses.length} course{courses.length !== 1 ? "s" : ""} added
            {courses.length < 4 && ` (minimum ${4 - courses.length} more required)`}
          </p>
          <div className="space-y-2">
            {courses.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span>{course}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCourse(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 