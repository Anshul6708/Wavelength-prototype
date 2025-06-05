"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, User, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold gradient-text">
            Wavelength
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </Link>

              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>

              <Link href="/profile">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-gray-700 text-gray-300 hover:text-white"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
