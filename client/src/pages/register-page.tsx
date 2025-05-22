"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      major: "",
      credits: 0,
      GPA: 0,
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMajorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, major: value }))
  }
  const addStudent = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/addStudent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if(response.status === 400){
        alert("Email already exists")
      }
      else if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        alert("Account added successfully!")
      }
      const result = await response.json();
      console.log(response.ok, result);
    } catch (error) {
      console.error("Error adding/updating student:", error);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Registration attempt with:", formData)
    addStudent()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black">Register</h1>
          <p className="mt-2 text-sm text-gray-600">Create your student account</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">
              Email address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="border-2 border-black bg-white text-black focus:border-black focus:ring-black"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-black">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="border-2 border-black bg-white text-black focus:border-black focus:ring-black"
              placeholder="••••••••"
            />
          </div>

          {/* First and Last Name (side by side) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-black">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="border-2 border-black bg-white text-black focus:border-black focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-black">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="border-2 border-black bg-white text-black focus:border-black focus:ring-black"
              />
            </div>
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label htmlFor="major" className="text-black">
              Major <span className="text-red-500">*</span>
            </Label>
            <Select required value={formData.major} onValueChange={handleMajorChange}>
              <SelectTrigger className="border-2 border-black bg-white text-black focus:border-black focus:ring-black">
                <SelectValue placeholder="Select your major" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer-science">Computer Science</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="psychology">Psychology</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional Fields */}
          <div className="space-y-2 rounded-md border-2 border-dashed border-gray-300 p-4">
            <p className="mb-2 text-sm font-medium text-gray-500">Optional Information</p>

            {/* Credits Taken */}
            <div className="space-y-2">
              <Label htmlFor="credits" className="text-black">
                Total Credits Taken
              </Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                min="0"
                max="200"
                value={formData.credits}
                onChange={handleChange}
                className="border-2 border-black bg-white text-black focus:border-black focus:ring-black"
                placeholder="0"
              />
            </div>

            {/* GPA */}
            <div className="space-y-2">
              <Label htmlFor="GPA" className="text-black">
                GPA
              </Label>
              <Input
                id="GPA"
                name="GPA"
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={formData.GPA}
                onChange={handleChange}
                className="border-2 border-black bg-white text-black focus:border-black focus:ring-black"
                placeholder="0.00"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Create Account
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-black hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
