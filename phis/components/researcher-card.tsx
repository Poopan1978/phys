import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

interface ResearcherCardProps {
  name: string
  field: string
  image: string
  university: string
  description: string
  profileUrl: string
}

export function ResearcherCard({ name, field, image, university, description, profileUrl }: ResearcherCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-serif">{name}</CardTitle>
        <p className="text-sm text-[#37b3a6] font-medium">{field}</p>
        <p className="text-xs text-gray-500">{university}</p>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm">{description}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full border-[#37b3a6] text-[#37b3a6] hover:bg-[#37b3a6] hover:text-white"
          asChild
        >
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            View Profile <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
