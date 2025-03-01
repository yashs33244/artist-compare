import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Info } from "lucide-react";
import {
  getDetailedMetrics,
  getSpotifyMetrics,
} from "../../app/utils/metricHelpers";

export const DetailedTab = ({ comparisonData }) => {
  return (
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
                {getDetailedMetrics(
                  artistName,
                  comparisonData.insights.artists
                ).map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {metric.icon}
                        <span className="font-medium">{metric.name}:</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 font-bold">{metric.value}</span>
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
                      getDetailedMetrics(
                        artistName,
                        comparisonData.insights.artists
                      ).length -
                        1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Spotify Statistics
                </h3>
                <div className="space-y-2">
                  {getSpotifyMetrics(artistName, comparisonData).map(
                    (stat, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {stat.name}:
                        </span>
                        <span className="text-sm font-medium">
                          {stat.value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="bg-muted/30">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Career Milestone: </span>
              {comparisonData.insights.artists[artistName].career_achievements
                ?.milestones || "N/A"}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
