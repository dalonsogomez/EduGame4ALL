import { createContext, useContext, useState, ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";
import { User } from "@shared/types/user";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  location?: string;
  nativeLanguage?: string;
  targetLanguage?: string;
  userType?: 'child' | 'adult' | 'educator';
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("accessToken");
  });
  const [user, setUser] = useState<User | null>(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  });

  const setAuthData = (accessToken, refreshToken, userData) => {
    if (accessToken || refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      throw new Error('Neither refreshToken nor accessToken was returned.');
    }
  };

  const resetAuth = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      const { accessToken, refreshToken, ...userData } = response;
      setAuthData(accessToken, refreshToken, userData);
    } catch (error) {
      resetAuth();
      throw new Error(error?.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiRegister(data);
      const { accessToken, refreshToken, token, user, ...userData } = response;
      setAuthData(accessToken || token, refreshToken, user || userData);
    } catch (error) {
      resetAuth();
      throw new Error(error?.message || 'Registration failed');
    }
  };

  const logout = () => {
    resetAuth();
    window.location.reload();
  };

  return (
      <AuthContext.Provider value={{
        user,
        isAuthenticated,
        login,
        register,
        logout
      }}>
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

