"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "../contexts/AuthContext"


export default function LoginPage() {
    const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill out all required fields.");
      return;
    }
    console.log(formData);
    handleLogin(formData);
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black">Sign in</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your credentials to access your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email address
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                defaultValue={formData.password}
                onChange={handleChange}
                className="border-2 border-black bg-white text-black focus:border-black focus:ring-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember-me" className="border-2 border-black text-black focus:ring-black" />
              <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                Remember me
              </Label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-black hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-black hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
