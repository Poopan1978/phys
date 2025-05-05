"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChatbotPopup } from "@/components/chatbot-popup"
import { MessageCircle } from "lucide-react"

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-6 text-[#033744]">Cambridge Physics Postgraduate Advisor</h1>
        <p className="text-lg mb-8 text-[#033744]">
          Find the perfect postgraduate physics program and supervisor at Cambridge University with our AI assistant.
        </p>

        <Button
          onClick={() => setIsPopupOpen(true)}
          className="bg-[#37b3a6] hover:bg-[#2a8a80] text-white text-lg px-6 py-6 rounded-lg"
          size="lg"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Open Advisor Chat
        </Button>
      </div>

      {/* Chatbot Popup */}
      <ChatbotPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* Floating chat button for easy access */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setIsPopupOpen(true)}
          className="bg-[#37b3a6] hover:bg-[#2a8a80] text-white h-14 w-14 rounded-full shadow-lg"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </main>
  )
}
