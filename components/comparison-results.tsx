import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { compareArtists } from "@/lib/actions";
import { calculateScore } from "@/lib/utils";
import { Award, DollarSign, TrendingUp, Users } from "lucide-react";

export default async function ComparisonResults({
  artistIds,
}: {
  artistIds: string[];
}) {
  const comparisonData = await compareArtists(artistIds);
  const { artists, comparisonPoints } = comparisonData;

  // Calculate overall scores
  const scores = artists.map((artist) => ({
    name: artist.name,
    score: calculateScore(artist),
  }));

  // Sort scores in descending order
  scores.sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-10">
      <Card>
        <CardHeader>
          <CardTitle>Overall Comparison</CardTitle>
          <CardDescription>
            Comprehensive score based on net worth, fame, and achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {scores.map((score, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={index === 0 ? "text-xl font-bold" : "text-lg"}
                    >
                      {score.name}
                    </span>
                    {index === 0 && (
                      <Award className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <span className="font-bold">{score.score} points</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted">
                  <div
                    className={`h-3 rounded-full ${
                      index === 0 ? "bg-primary" : "bg-secondary"
                    }`}
                    style={{
                      width: `${
                        (score.score /
                          Math.max(...scores.map((s) => s.score))) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Net Worth</CardTitle>
              <CardDescription>Financial success comparison</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {comparisonPoints.netWorth
                .sort((a, b) => b.value - a.value)
                .map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="font-bold">{item.formattedValue}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${
                            (item.value /
                              Math.max(
                                ...comparisonPoints.netWorth.map((i) => i.value)
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Monthly Listeners</CardTitle>
              <CardDescription>Current popularity comparison</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {comparisonPoints.monthlyListeners
                .sort((a, b) => b.value - a.value)
                .map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="font-bold">{item.formattedValue}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${
                            (item.value /
                              Math.max(
                                ...comparisonPoints.monthlyListeners.map(
                                  (i) => i.value
                                )
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Career Length</CardTitle>
              <CardDescription>Years active in the industry</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {comparisonPoints.careerLength
                .sort((a, b) => b.value - a.value)
                .map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="font-bold">{item.formattedValue}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${
                            (item.value /
                              Math.max(
                                ...comparisonPoints.careerLength.map(
                                  (i) => i.value
                                )
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Awards</CardTitle>
              <CardDescription>Major industry accolades</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {comparisonPoints.awards
                .sort((a, b) => b.value - a.value)
                .map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <span className="font-bold">{item.formattedValue}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${
                            (item.value /
                              Math.max(
                                ...comparisonPoints.awards.map((i) => i.value)
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Presence</CardTitle>
          <CardDescription>
            Total followers across Instagram, Twitter, and YouTube
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {comparisonPoints.socialMedia
              .sort((a, b) => b.total - a.total)
              .map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">{item.name}</span>
                    <span className="font-bold">
                      {item.formattedTotal} followers
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Instagram</span>
                      <span>{(item.instagram / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-pink-500"
                        style={{
                          width: `${
                            (item.instagram /
                              Math.max(
                                ...comparisonPoints.socialMedia.map(
                                  (i) => i.instagram
                                )
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Twitter</span>
                      <span>{(item.twitter / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{
                          width: `${
                            (item.twitter /
                              Math.max(
                                ...comparisonPoints.socialMedia.map(
                                  (i) => i.twitter
                                )
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>YouTube</span>
                      <span>{(item.youtube / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{
                          width: `${
                            (item.youtube /
                              Math.max(
                                ...comparisonPoints.socialMedia.map(
                                  (i) => i.youtube
                                )
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Spotify Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Spotify Performance</CardTitle>
          <CardDescription>
            Streaming metrics and platform engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {comparisonPoints.spotifyMetrics
              .sort((a, b) => b.monthlyListeners - a.monthlyListeners)
              .map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">{item.name}</span>
                    <span className="font-bold">
                      {item.formattedListeners} monthly listeners
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Monthly Listeners</span>
                        <span>{item.formattedListeners}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${
                              (item.monthlyListeners /
                                Math.max(
                                  ...comparisonPoints.spotifyMetrics.map(
                                    (i) => i.monthlyListeners
                                  )
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Followers</span>
                        <span>{item.formattedFollowers}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${
                              (item.followers /
                                Math.max(
                                  ...comparisonPoints.spotifyMetrics.map(
                                    (i) => i.followers
                                  )
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Popularity Score</span>
                        <span>{item.popularity}/100</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{
                            width: `${(item.popularity / 100) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Concert Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Concert Performance</CardTitle>
          <CardDescription>
            Live performance metrics and revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {comparisonPoints.concertMetrics
              .sort((a, b) => b.grossPerShow - a.grossPerShow)
              .map((item, index) => (
                <div key={index} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">{item.name}</span>
                    <span className="font-bold">
                      {item.formattedGrossPerShow} per show
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Gross per Show</span>
                        <span>{item.formattedGrossPerShow}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{
                            width: `${
                              (item.grossPerShow /
                                Math.max(
                                  ...comparisonPoints.concertMetrics.map(
                                    (i) => i.grossPerShow
                                  )
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Average Ticket Price</span>
                        <span>${item.averageTicketPrice}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{
                            width: `${
                              (item.averageTicketPrice /
                                Math.max(
                                  ...comparisonPoints.concertMetrics.map(
                                    (i) => i.averageTicketPrice
                                  )
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Total Concerts</span>
                        <span>{item.totalConcerts}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{
                            width: `${
                              (item.totalConcerts /
                                Math.max(
                                  ...comparisonPoints.concertMetrics.map(
                                    (i) => i.totalConcerts
                                  )
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Last Year Revenue</span>
                        <span>{item.formattedRevenue}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{
                            width: `${
                              (item.lastYearRevenue /
                                Math.max(
                                  ...comparisonPoints.concertMetrics.map(
                                    (i) => i.lastYearRevenue
                                  )
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
