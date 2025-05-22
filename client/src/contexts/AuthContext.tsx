import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    const navigate = useNavigate();
    const [userID, setUserID] = useState<number>(0);
    const handleLogin = async (studentInfo: { email: string; password: string }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/loginStudent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studentInfo),
            });

            if (!response.ok) {
                throw new Error(`Login failed with status: ${response.status}`);
            }
            const data = await response.json();
            setUserID(data);
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    };

    useEffect(() => {
        if (userID > 0) {
            navigate("/dashboard");
        }
    }, [userID, navigate]);

    return (
        <AuthContext.Provider value={{ userID, handleLogin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
