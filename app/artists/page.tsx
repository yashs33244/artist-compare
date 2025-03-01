import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { getAllArtists } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

export default async function ArtistsPage() {
  const artists = await getAllArtists()

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Artists</h1>
        <p className="mt-2 text-muted-foreground">Browse and compare all artists in our database</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {artists.map((artist) => (
          <Card key={artist.id} className="artist-card overflow-hidden">
            <div className="aspect-square w-full overflow-hidden">
              <Image
                src={artist.imageUrl || "/placeholder.svg?height=400&width=400"}
                alt={artist.name}
                width={400}
                height={400}
                className="h-full w-full object-cover transition-all hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle>{artist.name}</CardTitle>
              <CardDescription>{artist.genre}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Net Worth:</span>
                  <span className="font-medium">{formatCurrency(artist.netWorth)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Listeners:</span>
                  <span className="font-medium">{(artist.monthlyListeners / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Career Start:</span>
                  <span className="font-medium">{artist.careerStart}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/artists/${artist.id}`}>
                  View Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

