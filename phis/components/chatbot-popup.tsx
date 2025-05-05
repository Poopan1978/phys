"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Send, Loader2, ExternalLink, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface ChatbotPopupProps {
  isOpen: boolean
  onClose: () => void
}

type Message = {
  role: "user" | "assistant" | "system"
  content: string
}

type Program = {
  name: string
  description: string
  url: string
}

type Supervisor = {
  name: string
  department: string
  research: string
  url: string
}

type Results = {
  programs: Program[]
  supervisors: Supervisor[]
}

export function ChatbotPopup({ isOpen, onClose }: ChatbotPopupProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are a helpful assistant for Cambridge Physics postgraduate admissions.",
    },
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your Cambridge Physics postgraduate advisor. I can help you find suitable programs and supervisors based on your background and interests.\n\nTo get started, could you tell me about the physics courses you completed during your undergraduate studies?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Focus input when popup opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isOpen])

  // Handle keyboard accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // In a real implementation, we would use the AI SDK to generate a response
      // For demo purposes, we'll simulate the AI response

      const userMessages = [...messages, userMessage]
        .filter((m) => m.role !== "system")
        .map((m) => m.content)
        .join("\n")

      // Check if this is the second user message (after background, asking for interests)
      const isSecondUserMessage = messages.filter((m) => m.role === "user").length === 1

      let aiResponse: string

      if (isSecondUserMessage) {
        aiResponse =
          "Thank you for sharing your background. Now, could you tell me about your research interests in physics? For example, are you interested in quantum physics, astrophysics, condensed matter, etc.?"
      } else if (messages.filter((m) => m.role === "user").length === 2) {
        // This is the third interaction, after getting background and interests
        aiResponse =
          "Thank you for providing your information. Based on your background and interests, I've found some potential matches for you. Please see the recommendations below."

        // Generate mock results
        setResults({
          programs: [
            {
              name: "MASt in Physics",
              description:
                "A one-year taught master's course aimed at those who wish to pursue research in physics but require additional training to reach the level of the Cambridge PhD.",
              url: "https://www.phy.cam.ac.uk/study/postgraduate/mast-physics",
            },
            {
              name: "PhD in Physics",
              description:
                "Research-based doctoral program covering various fields including quantum physics, condensed matter, and theoretical physics.",
              url: "https://www.phy.cam.ac.uk/study/postgraduate/phd-physics",
            },
            {
              name: "MPhil in Scientific Computing",
              description:
                "One-year research master's program focusing on computational methods in physics and other scientific disciplines.",
              url: "https://www.phy.cam.ac.uk/study/postgraduate/mphil-scientific-computing",
            },
          ],
          supervisors: [
            {
              name: "Professor Didier Queloz",
              department: "Cavendish Laboratory",
              research: "Exoplanets and astrophysics, Nobel Prize winner for discovery of exoplanets.",
              url: "https://www.phy.cam.ac.uk/people/queloz",
            },
            {
              name: "Professor Richard Friend",
              department: "Cavendish Laboratory",
              research: "Condensed matter physics, organic semiconductors and optoelectronic devices.",
              url: "https://www.phy.cam.ac.uk/people/friend",
            },
            {
              name: "Dr. Suchitra Sebastian",
              department: "Cavendish Laboratory",
              research:
                "Quantum materials, strongly correlated electron systems, and high-temperature superconductivity.",
              url: "https://www.phy.cam.ac.uk/people/sebastian",
            },
          ],
        })

        setShowResults(true)
      } else {
        aiResponse =
          "Is there anything specific about these recommendations you'd like to know more about? Or would you like to explore different research areas?"
      }

      // In a real implementation, we would use the AI SDK like this:
      // const { text: aiResponse } = await generateText({
      //   model: openai("gpt-4o"),
      //   prompt: userMessages,
      //   system: "You are a helpful assistant for Cambridge Physics postgraduate admissions. Provide concise, helpful responses."
      // })

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#033744] text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" aria-hidden="true" />
            <h2 id="chat-title" className="text-xl font-semibold">
              Cambridge Physics Advisor
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-[#37b3a6]"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50" aria-live="polite" aria-atomic="false">
          {messages
            .filter((m) => m.role !== "system")
            .map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                aria-label={`${message.role === "user" ? "You" : "Assistant"}: ${message.content}`}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 mr-2 bg-[#37b3a6] text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">CA</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-[#37b3a6] text-white rounded-tr-none"
                      : "bg-white border border-[#a0e9dd] rounded-tl-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                {message.role === "user" && (
                  <div className="h-8 w-8 ml-2 bg-[#a0e9dd] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">You</span>
                  </div>
                )}
              </div>
            ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="h-8 w-8 mr-2 bg-[#37b3a6] text-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs">CA</span>
              </div>
              <div className="bg-white border border-[#a0e9dd] p-3 rounded-lg rounded-tl-none">
                <Loader2 className="h-5 w-5 animate-spin text-[#37b3a6]" aria-label="Loading response" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Results Section */}
        {showResults && results && (
          <div className="border-t border-[#a0e9dd] p-4 bg-white">
            <Tabs defaultValue="programs">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
              </TabsList>

              <TabsContent value="programs" className="space-y-3">
                {results.programs.map((program, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#033744] mb-1">{program.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{program.description}</p>
                      <a
                        href={program.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#37b3a6] hover:text-[#2a8a80] flex items-center"
                        aria-label={`Learn more about ${program.name}`}
                      >
                        Learn more <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="supervisors" className="space-y-3">
                {results.supervisors.map((supervisor, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-[#033744] mb-1">{supervisor.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{supervisor.department}</p>
                      <p className="text-sm text-gray-600 mb-2">{supervisor.research}</p>
                      <a
                        href={supervisor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#37b3a6] hover:text-[#2a8a80] flex items-center"
                        aria-label={`View profile of ${supervisor.name}`}
                      >
                        View profile <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-[#a0e9dd] p-4 bg-white">
          <div className="flex items-end gap-2">
            <label htmlFor="chat-input" className="sr-only">
              Type your message
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 border border-[#a0e9dd] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#37b3a6] min-h-[80px] max-h-[150px] resize-none"
              disabled={isLoading}
              aria-label="Type your message"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#37b3a6] hover:bg-[#2a8a80] text-white h-10 px-4"
              aria-label={isLoading ? "Sending message" : "Send message"}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
