"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Loader2,
  ExternalLink,
  Award,
  DollarSign,
  Music,
  Globe,
  TrendingUp,
  Users,
  Calendar,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ArtistData {
  name: string;
  popularity: number;
  followers: number;
  genres: string;
  imageUrl: string;
}

interface ArtistMetrics {
  net_worth: number;
  earnings_per_performance: number;
  career_achievements: {
    hits: number;
    milestones: string;
  };
  global_influence: number;
  awards_recognition: number;
  collaborations: number;
  genre_impact: number;
  commercial_success: number;
  longevity: number;
  insights?: string;
  sources?: {
    net_worth?: string;
    earnings?: string;
    awards?: string;
    streaming?: string;
    general?: string;
    [key: string]: string | undefined;
  };
}

interface ComparisonData {
  artists: ArtistData[];
  insights: {
    artists: {
      [key: string]: ArtistMetrics;
    };
  };
  spotify_data?: {
    name: string;
    popularity: number;
    followers: number;
    genres: string[];
  }[];
  parsing_error?: boolean;
  raw_content?: string;
}

export default function ArtistComparisonResults({
  artistIds,
}: {
  artistIds: string[];
}) {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/compare?artists=${artistIds.join(",")}`
        );
        if (!response.ok) throw new Error("Failed to fetch comparison data");
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setComparisonData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [artistIds]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p>Analyzing and comparing artist data...</p>
        <p className="text-sm text-muted-foreground mt-2">
          This may take a moment as we gather comprehensive insights
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Error Loading Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (
    !comparisonData ||
    !comparisonData.insights ||
    !comparisonData.insights.artists
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Could not retrieve or parse comparison data. Please try again with
            different artists.
          </p>
          {comparisonData?.parsing_error && (
            <div className="mt-4">
              <p className="text-destructive font-medium">
                Parsing Error Detected
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                The AI response couldn't be properly parsed.
              </p>
            </div>
          )}
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Format data for charts
  const formatChartData = (category: keyof ArtistMetrics) => {
    return Object.entries(comparisonData.insights.artists).map(
      ([name, data], index) => ({
        name,
        value: data[category] || 0,
        color: COLORS[index % COLORS.length],
      })
    );
  };

  // Get detailed metrics with icons and sources
  const getDetailedMetrics = (artistName: string) => {
    const artistData = comparisonData.insights.artists[artistName];
    if (!artistData) return [];

    return [
      {
        name: "Net Worth",
        value: `$${artistData.net_worth}M`,
        icon: <DollarSign className="h-4 w-4" />,
        source: artistData.sources?.net_worth,
      },
      {
        name: "Earnings/Show",
        value: `$${artistData.earnings_per_performance}K`,
        icon: <DollarSign className="h-4 w-4" />,
        source: artistData.sources?.earnings,
      },
      {
        name: "Hit Songs",
        value: artistData.career_achievements?.hits || "N/A",
        icon: <Music className="h-4 w-4" />,
        source: artistData.sources?.streaming,
      },
      {
        name: "Global Influence",
        value: `${artistData.global_influence}/10`,
        icon: <Globe className="h-4 w-4" />,
        source: artistData.sources?.general,
      },
      {
        name: "Awards",
        value: artistData.awards_recognition,
        icon: <Award className="h-4 w-4" />,
        source: artistData.sources?.awards,
      },
      {
        name: "Collaborations",
        value: artistData.collaborations,
        icon: <Users className="h-4 w-4" />,
        source: null,
      },
      {
        name: "Genre Impact",
        value: artistData.genre_impact,
        icon: <TrendingUp className="h-4 w-4" />,
        source: null,
      },
      {
        name: "Years Active",
        value: artistData.longevity,
        icon: <Calendar className="h-4 w-4" />,
        source: null,
      },
    ];
  };

  // Get Spotify data display
  const getSpotifyMetrics = (artistName: string) => {
    const spotifyData = comparisonData.spotify_data?.find(
      (artist) => artist.name === artistName
    );

    if (!spotifyData) {
      const basicData = comparisonData.artists.find(
        (artist) => artist.name === artistName
      );

      return basicData
        ? [
            { name: "Popularity", value: basicData.popularity },
            { name: "Followers", value: basicData.followers.toLocaleString() },
            { name: "Genres", value: basicData.genres || "N/A" },
          ]
        : [];
    }

    return [
      { name: "Popularity", value: spotifyData.popularity },
      { name: "Followers", value: spotifyData.followers.toLocaleString() },
      { name: "Genres", value: spotifyData.genres.join(", ") || "N/A" },
    ];
  };

  return (
    <div className="space-y-8">
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.keys(comparisonData.insights.artists).map((artistName) => {
              const artistData = comparisonData.insights.artists[artistName];
              const artistBasicData = comparisonData.artists.find(
                (a) => a.name === artistName
              );

              return (
                <Card key={artistName} className="overflow-hidden">
                  <CardHeader className="bg-primary/10">
                    <div className="flex items-center justify-between">
                      <CardTitle>{artistName}</CardTitle>
                      <Badge variant="outline">
                        {artistBasicData?.genres?.split(",")[0] || "Artist"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {artistBasicData?.followers.toLocaleString()} followers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
                        <DollarSign className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-sm font-medium">Net Worth</span>
                        <span className="text-lg font-bold">
                          ${artistData.net_worth}M
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
                        <Award className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-sm font-medium">Awards</span>
                        <span className="text-lg font-bold">
                          {artistData.awards_recognition}
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
                        <Globe className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-sm font-medium">Influence</span>
                        <span className="text-lg font-bold">
                          {artistData.global_influence}/10
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
                        <Calendar className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-sm font-medium">
                          Years Active
                        </span>
                        <span className="text-lg font-bold">
                          {artistData.longevity}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">
                        Career Highlight:
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {artistData.career_achievements?.milestones ||
                          "No information available"}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("detailed")}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("insights")}
                    >
                      Read Insights
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="detailed">
          <div className="grid gap-6 md:grid-cols-2">
            {Object.keys(comparisonData.insights.artists).map((artistName) => (
              <Card key={artistName}>
                <CardHeader>
                  <CardTitle>{artistName}</CardTitle>
                  <CardDescription>
                    Comprehensive metrics and industry standing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80 pr-4">
                    <div className="space-y-4">
                      {getDetailedMetrics(artistName).map((metric, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {metric.icon}
                              <span className="font-medium">
                                {metric.name}:
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2 font-bold">
                                {metric.value}
                              </span>
                              {metric.source && (
                                <a
                                  href={metric.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                          {index <
                            getDetailedMetrics(artistName).length - 1 && (
                            <Separator className="my-2" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold mb-2 flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        Spotify Statistics
                      </h3>
                      <div className="space-y-2">
                        {getSpotifyMetrics(artistName).map((stat, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              {stat.name}:
                            </span>
                            <span className="text-sm font-medium">
                              {stat.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="bg-muted/30">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Career Milestone: </span>
                    {comparisonData.insights.artists[artistName]
                      .career_achievements?.milestones || "N/A"}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Net Worth Comparison</CardTitle>
                <CardDescription>
                  Estimated artist net worth in millions USD
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatChartData("net_worth")}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}M`} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {formatChartData("net_worth").map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earnings Per Performance</CardTitle>
                <CardDescription>
                  Average earnings per show in thousands USD
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatChartData("earnings_per_performance")}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}K`} />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d">
                      {formatChartData("earnings_per_performance").map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Influence</CardTitle>
                <CardDescription>
                  Industry impact score (scale of 1-10)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatChartData("global_influence")}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#ffc658">
                      {formatChartData("global_influence").map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Awards & Recognition</CardTitle>
                <CardDescription>
                  Major awards won throughout career
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatChartData("awards_recognition")}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#ff8042">
                      {formatChartData("awards_recognition").map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid gap-6 md:grid-cols-2">
            {Object.keys(comparisonData.insights.artists).map((artistName) => {
              const artistData = comparisonData.insights.artists[artistName];
              return (
                <Card key={artistName}>
                  <CardHeader className="bg-primary/5">
                    <CardTitle>{artistName}</CardTitle>
                    <CardDescription>
                      Career insights and industry impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm leading-relaxed">
                      {artistData.insights ||
                        `${artistName} has achieved significant success in the music industry with a net worth of $${
                          artistData.net_worth
                        }M and earning approximately $${
                          artistData.earnings_per_performance
                        }K per performance. With ${
                          artistData.career_achievements?.hits || "multiple"
                        } hit songs and ${
                          artistData.awards_recognition
                        } major awards, they've been active for ${
                          artistData.longevity
                        } years and have collaborated with ${
                          artistData.collaborations
                        } notable artists throughout their career.`}
                    </p>

                    <div className="mt-6 space-y-2">
                      <h4 className="font-medium text-sm">Key Achievements:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li>Net worth of ${artistData.net_worth} million</li>
                        <li>
                          Average of ${artistData.earnings_per_performance}K per
                          performance
                        </li>
                        <li>
                          {artistData.awards_recognition} major industry awards
                        </li>
                        <li>
                          {artistData.career_achievements?.hits || "Multiple"}{" "}
                          chart-topping hits
                        </li>
                        <li>
                          {artistData.collaborations} notable collaborations
                        </li>
                        <li>
                          Global influence rating: {artistData.global_influence}
                          /10
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-sm">Career Milestone:</h4>
                      <p className="text-sm mt-1 text-muted-foreground italic">
                        "
                        {artistData.career_achievements?.milestones ||
                          "Information not available"}
                        "
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 justify-between">
                    <span className="text-xs text-muted-foreground">
                      Active for {artistData.longevity} years
                    </span>
                    {artistData.sources?.general && (
                      <a
                        href={artistData.sources.general}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Learn more <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                References and citations for artist information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 pr-4">
                <div className="space-y-4">
                  {Object.keys(comparisonData.insights.artists).map(
                    (artistName) => {
                      const artistData =
                        comparisonData.insights.artists[artistName];
                      return (
                        <div key={artistName}>
                          <h3 className="font-semibold mb-2">{artistName}</h3>
                          <div className="space-y-2">
                            {Object.entries(artistData.sources || {}).map(
                              ([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">
                                    {key.replace(/_/g, " ")}:
                                  </span>
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                  >
                                    View Source{" "}
                                    <ExternalLink className="h-3 w-3 inline-block" />
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                          <Separator className="my-4" />
                        </div>
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
