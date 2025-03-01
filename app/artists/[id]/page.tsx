import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Award, DollarSign, TrendingUp, Users } from "lucide-react"
import { getArtistById, getRelatedArtists } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import ArtistInsights from "@/components/artist-insights"

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const artist = await getArtistById(params.id)

  if (!artist) {
    notFound()
  }

  const relatedArtists = await getRelatedArtists(params.id)
  const careerLength = new Date().getFullYear() - artist.careerStart

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Artist Profile */}
        <div className="md:col-span-2">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="h-48 w-48 overflow-hidden rounded-lg">
                <Image
                  src={artist.imageUrl || "/placeholder.svg?height=200&width=200"}
                  alt={artist.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold tracking-tight">{artist.name}</h1>
                <p className="text-xl text-muted-foreground">{artist.genre}</p>
                <div className="mt-4 flex gap-2">
                  <Button asChild>
                    <Link href={`/compare?artists=${artist.id}`}>Compare Artist</Link>
                  </Button>
                  <Button variant="outline">Add to Favorites</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardHeader className="p-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardTitle className="text-xl">{formatCurrency(artist.netWorth)}</CardTitle>
                  <CardDescription>Net Worth</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardTitle className="text-xl">{(artist.monthlyListeners / 1000000).toFixed(1)}M</CardTitle>
                  <CardDescription>Monthly Listeners</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardTitle className="text-xl">{careerLength} years</CardTitle>
                  <CardDescription>Career Length</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <Award className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardTitle className="text-xl">{artist.awards.length}</CardTitle>
                  <CardDescription>Major Awards</CardDescription>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{artist.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>Powered by DeepSeek AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ArtistInsights artistName={artist.name} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Career Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {artist.careerStart}
                    </div>
                    <div>
                      <h3 className="font-medium">Career Start</h3>
                      <p className="text-sm text-muted-foreground">
                        Early income: {formatCurrency(artist.earlyIncome)} per year
                      </p>
                    </div>
                  </div>
                  {artist.albums.map((album, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                        {album.year}
                      </div>
                      <div>
                        <h3 className="font-medium">{album.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Album sales: {(album.sales / 1000000).toFixed(1)}M copies
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      Now
                    </div>
                    <div>
                      <h3 className="font-medium">Current Status</h3>
                      <p className="text-sm text-muted-foreground">Net worth: {formatCurrency(artist.netWorth)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media Presence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Instagram Followers</span>
                    <span className="font-medium">{(artist.socialMedia.instagram / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.min((artist.socialMedia.instagram / 300000000) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Twitter Followers</span>
                    <span className="font-medium">{(artist.socialMedia.twitter / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.min((artist.socialMedia.twitter / 100000000) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>YouTube Subscribers</span>
                    <span className="font-medium">{(artist.socialMedia.youtube / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.min((artist.socialMedia.youtube / 60000000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Awards & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {artist.awards.map((award, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Albums</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {artist.albums.map((album, index) => (
                    <li key={index}>
                      <div className="flex justify-between">
                        <span className="font-medium">{album.name}</span>
                        <span className="text-muted-foreground">{album.year}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Sales: {(album.sales / 1000000).toFixed(1)}M</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relatedArtists.map((relatedArtist) => (
                    <Link
                      key={relatedArtist.id}
                      href={`/artists/${relatedArtist.id}`}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted"
                    >
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={relatedArtist.imageUrl || "/placeholder.svg?height=40&width=40"}
                          alt={relatedArtist.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{relatedArtist.name}</p>
                        <p className="text-xs text-muted-foreground">{relatedArtist.genre}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 pt-0">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/artists">
                    View All Artists <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

