import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "../services/api";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: "customer" | "admin" | "staff" | "superadmin";
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User }>;
  register: (name: string, email: string, password: string) => Promise<{ user: User }>;
  logout: () => void;
  updateUser: (user: User) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && user) {
      api.get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("authUser", JSON.stringify(res.data.user));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const isLoggedIn = user !== null;

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
    return { user: userData };
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
    return { user: userData };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await api.put("/auth/change-password", { currentPassword, newPassword });
  };

  const forgotPassword = async (email: string) => {
    await api.post("/auth/forgot-password", { email });
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    await api.post("/auth/reset-password", { email, code, password: newPassword });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, register, logout, updateUser, changePassword, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
