"use client"

import { useChat } from "ai/react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Sparkles } from "lucide-react"
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChatHeader } from "@/components/chat-header"

export default function ChatPage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    onFinish: async (message) => {
      if (user) {
        const updatedHistory = [
          ...user.chatHistory,
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: new Date(),
          })),
          {
            role: "assistant" as const,
            content: message.content,
            timestamp: new Date(),
          },
        ]

        updateUser({ chatHistory: updatedHistory })

        // Generate profile summary after significant conversation
        if (updatedHistory.length >= 10) {
          await generateProfileSummary()
        }
      }
    },
  })

  const generateProfileSummary = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory: user.chatHistory }),
      })

      const { summary } = await response.json()
      updateUser({ profileSummary: summary })
    } catch (error) {
      console.error("Failed to generate summary:", error)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
  }, [user, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <Card className="bg-gray-900 border-gray-800 p-6 text-center">
            <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Welcome to your Wavelength chat</h2>
            <p className="text-gray-400">
              Start a conversation to discover your unique wavelength. I'll help you explore your thoughts, interests,
              and personality.
            </p>
          </Card>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-white"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2 pt-4 border-t border-gray-800">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Share your thoughts..."
          className="flex-1 bg-gray-800 border-gray-700 text-white"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
