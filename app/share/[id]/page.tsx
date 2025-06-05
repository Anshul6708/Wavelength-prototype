import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar } from "lucide-react"

// Mock function to get user profile - in production, fetch from database
async function getUserProfile(id: string) {
  // This would typically fetch from your database
  return {
    id,
    phone: "+1 (555) 123-4567",
    profileSummary:
      "This person demonstrates a curious and analytical mindset with a strong interest in technology and creative problem-solving. They show excellent communication skills and a collaborative approach to challenges. Their wavelength resonates with innovation, continuous learning, and meaningful connections.",
    createdAt: new Date().toISOString(),
  }
}

export default async function ShareProfilePage({ params }: { params: { id: string } }) {
  const profile = await getUserProfile(params.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text">Wavelength Profile</h1>
          <p className="text-gray-400">Discover someone's unique wavelength</p>
        </div>

        <Card className="bg-gray-900/80 backdrop-blur border-gray-800">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-white text-xl">Anonymous Wavelength</CardTitle>
            <div className="flex items-center justify-center text-gray-400 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              Generated {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-center">{profile.profileSummary}</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-500 text-sm">Want to discover your own wavelength?</p>
          <a href="/" className="text-purple-400 hover:text-purple-300 font-medium">
            Get started at Wavelength
          </a>
        </div>
      </div>
    </div>
  )
}
