import { NextResponse } from "next/server"
import OpenAI from "openai"

// Log environment variables (for debugging)
console.log("Environment variables:", {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  keyLength: process.env.OPENAI_API_KEY?.length,
  keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10),
  envKeys: Object.keys(process.env).filter(key => key.includes('OPENAI')),
  nodeEnv: process.env.NODE_ENV
})

// Test OpenAI API key immediately
async function testOpenAIKey() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("No OpenAI API key found in environment variables")
    }

    console.log("Testing OpenAI API key...")
    const testOpenai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })
    
    // This will throw an error if the API key is invalid
    const models = await testOpenai.models.list()
    console.log("OpenAI API key is valid! Available models:", models.data.map(m => m.id))
  } catch (error) {
    console.error("OpenAI API key test failed:", error)
    if (error instanceof Error) {
      console.error("Test error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
  }
}

// Run the test
testOpenAIKey().catch(console.error)

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OpenAI API key. Please add OPENAI_API_KEY to your .env file.")
  throw new Error("Missing OpenAI API key. Please add OPENAI_API_KEY to your .env file.")
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for development
})

export async function POST(req: Request) {
  try {
    console.log("Request headers:", Object.fromEntries(req.headers.entries()))
    
    const body = await req.json()
    const { message } = body

    // Log the request for debugging
    console.log("Received request with message:", message)

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Log the OpenAI API call
    console.log("Making OpenAI API call with key:", process.env.OPENAI_API_KEY?.substring(0, 5) + "...")

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful academic advisor for prospective postgraduate physics students. Your goal is to recommend the most suitable postgraduate programmes and supervisors at the University of Cambridge, based on two user inputs: 1) the specific physics or science-related undergraduate courses the student has completed (minimum 4, maximum 10), and 2) their future research interests within physics.\n\nUse the programme list from https://www.phy.cam.ac.uk/study/postgraduate/ and match these with the student's background and interests. Also, suggest suitable supervisors by referencing research areas and staff listed at https://www.phy.cam.ac.uk/people/.\n\nTill the student does not share minimum 4 undergraduate courses continue asking. Also, recommend supervisors only for PhD programmes and not for masters. For masters just state the relevant programme.\n\nYour recommendations must include:\n- Programme Name (as listed on the website)\n- A short reason why it's a good fit, based on courses and research interest\n- 2–3 suitable supervisors aligned with that research theme\n- Clickable links to both the programme and supervisor profile pages (if available)\n\nIf the user's inputs are too general, ask clarifying questions to narrow down the field (e.g., 'Are you interested in quantum optics or condensed matter?' or 'Did you take any lab-based or computational courses?').\n\nAlways be clear, friendly, and concise in your tone. Use bullet points where helpful."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    // Log the response
    console.log("OpenAI API response:", completion)

    return NextResponse.json({
      response: completion.choices[0].message.content
    })

  } catch (error) {
    console.error("Error in chat API:", error)
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    )
  }
} 