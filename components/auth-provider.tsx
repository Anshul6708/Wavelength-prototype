"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  phone: string
  profileSummary?: string
  chatHistory: Array<{
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }>
}

interface AuthContextType {
  user: User | null
  login: (phone: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("wavelength-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (phone: string) => {
    // Mock OTP verification - in production, implement real OTP
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      phone,
      chatHistory: [],
    }
    setUser(newUser)
    localStorage.setItem("wavelength-user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("wavelength-user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("wavelength-user", JSON.stringify(updatedUser))
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
