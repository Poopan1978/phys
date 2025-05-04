import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

interface ProgramCardProps {
  title: string
  university: string
  image: string
  description: string
  programUrl: string
}

export function ProgramCard({ title, university, image, description, programUrl }: ProgramCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-40 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-serif">{title}</CardTitle>
        <p className="text-sm text-gray-500">{university}</p>
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
          <a href={programUrl} target="_blank" rel="noopener noreferrer">
            Learn More <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
