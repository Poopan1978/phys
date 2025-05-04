"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Loader2, BookOpen, Compass, ExternalLink } from "lucide-react"
import { CourseInput } from "@/components/course-input"
import { useToast } from "@/components/ui/use-toast"

type ChatStep = "background" | "interests" | "results"
type ResultType = "programs" | "supervisors"

interface Program {
  name: string
  description: string
  url: string
  supervisors: string[]
}

interface Supervisor {
  name: string
  university: string
  field: string
  description: string
  url: string
}

interface ChatResults {
  programs: Program[]
  supervisors: Supervisor[]
}

export function ChatInterface() {
  const { toast } = useToast()
  const [step, setStep] = useState<ChatStep>("background")
  const [courses, setCourses] = useState<string[]>([])
  const [interests, setInterests] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ChatResults | null>(null)

  const handleCoursesChange = (newCourses: string[]) => {
    setCourses(newCourses)
  }

  const generateRecommendations = async () => {
    try {
      setIsLoading(true)
      console.log("Sending request with courses:", courses)
      console.log("Sending request with interests:", interests)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courses,
          interests,
        }),
      })

      console.log("API Response status:", response.status)
      const data = await response.json()
      console.log("API Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recommendations")
      }

      if (!data.programs || !data.supervisors) {
        throw new Error("Invalid response format from API")
      }

      setResults(data)
      setStep("results")
    } catch (error) {
      console.error("Error generating recommendations:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate recommendations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (step === "background") {
      if (courses.length < 4) {
        toast({
          title: "Incomplete Information",
          description: "Please add at least 4 courses before proceeding",
          variant: "destructive",
        })
        return
      }
      setStep("interests")
    } else if (step === "interests") {
      if (!interests.trim()) {
        toast({
          title: "Incomplete Information",
          description: "Please enter your research interests before proceeding",
          variant: "destructive",
        })
        return
      }
      generateRecommendations()
    }
  }

  const handleBack = () => {
    if (step === "interests") {
      setStep("background")
    } else if (step === "results") {
      setStep("interests")
    }
  }

  const resetChat = () => {
    setStep("background")
    setCourses([])
    setInterests("")
    setResults(null)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          {step === "background" && "Your Physics Background"}
          {step === "interests" && "Your Research Interests"}
          {step === "results" && "Recommended Programs & Supervisors"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === "background" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please add at least 4 physics courses you have completed during your undergraduate degree.
              You can add up to 10 courses.
            </p>
            <CourseInput onCoursesChange={handleCoursesChange} />
          </div>
        )}

        {step === "interests" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please describe your research interests and areas you would like to explore in your postgraduate studies.
            </p>
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Enter your research interests..."
              className="w-full h-32 p-2 border rounded-md"
            />
          </div>
        )}

        {step === "results" && results && (
            <Tabs defaultValue="programs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
              </TabsList>
            <TabsContent value="programs">
              <div className="space-y-4">
                {results.programs.map((program, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{program.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{program.description}</p>
                      {program.supervisors && program.supervisors.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium mb-2">Suggested Supervisors:</p>
                          <ul className="list-disc list-inside">
                            {program.supervisors.map((supervisor, idx) => (
                              <li key={idx}>{supervisor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="link">
                        <a href={program.url} target="_blank" rel="noopener noreferrer">
                          Learn More <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              </TabsContent>
            <TabsContent value="supervisors">
              <div className="space-y-4">
                {results.supervisors.map((supervisor, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{supervisor.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{supervisor.field}</p>
                      <p className="mt-2">{supervisor.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="link">
                        <a href={supervisor.url} target="_blank" rel="noopener noreferrer">
                          View Profile <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              </TabsContent>
            </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={step === "background" ? resetChat : handleBack}
          disabled={isLoading}
        >
          {step === "background" ? "Reset" : "Back"}
          </Button>
          <Button
            onClick={handleNext}
          disabled={isLoading || (step === "results" && !results)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
              </>
          ) : step === "results" ? (
            "Start Over"
            ) : (
            "Next"
            )}
          </Button>
      </CardFooter>
    </Card>
  )
}
