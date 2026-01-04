import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/current", {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = () => {
        window.location.href = "http://localhost:5000/auth/google";
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:5000/auth/logout", {
                credentials: "include",
            });
            setUser(null);
            window.location.href = "/";
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
