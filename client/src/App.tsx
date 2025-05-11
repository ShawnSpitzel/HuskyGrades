import { set } from "lodash";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import StudentDashboard from "./pages/student-dashboard"
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";


export default function Home() {
  return (
    <div className="">
        <AuthProvider>
        <Routes>
        <Route path="/login" element={<LoginPage/>}> </Route>
          <Route path="/dashboard" element={<StudentDashboard />}> </Route>
          <Route path="/register" element={<RegisterPage />}> </Route>
        </Routes>
        </AuthProvider>
    </div>
  )
}
