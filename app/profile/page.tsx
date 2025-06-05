"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, User, MessageCircle, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [shareableLink, setShareableLink] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    if (user.profileSummary) {
      setShareableLink(`${window.location.origin}/share/${user.id}`)
    }
  }, [user, router])

  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableLink)
    toast({
      title: "Link copied!",
      description: "Shareable profile link copied to clipboard",
    })
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Your Wavelength Profile</h1>
        <p className="text-gray-400">Discover insights from your conversations</p>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="summary" className="data-[state=active]:bg-purple-600">
            <User className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="conversations" className="data-[state=active]:bg-purple-600">
            <MessageCircle className="h-4 w-4 mr-2" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="share" className="data-[state=active]:bg-purple-600">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Your Wavelength Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {user.profileSummary ? (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">{user.profileSummary}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    Continue chatting to generate your personalized wavelength summary
                  </p>
                  <Button onClick={() => router.push("/chat")} className="bg-purple-600 hover:bg-purple-700">
                    Start Chatting
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Chat History</CardTitle>
            </CardHeader>
            <CardContent>
              {user.chatHistory.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {user.chatHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-md px-3 py-2 rounded-lg text-sm ${
                          message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No conversations yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Share Your Wavelength</CardTitle>
            </CardHeader>
            <CardContent>
              {user.profileSummary ? (
                <div className="space-y-4">
                  <p className="text-gray-300">Share your unique wavelength profile with others</p>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={shareableLink}
                      readOnly
                      className="flex-1 bg-gray-800 border-gray-700 text-white px-3 py-2 rounded"
                    />
                    <Button onClick={copyShareableLink} className="bg-purple-600 hover:bg-purple-700">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Complete your chat to generate a shareable profile</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
