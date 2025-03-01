import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

export const SourcesTab = ({ comparisonData }) => {
  return (
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
            {Object.keys(comparisonData.insights.artists).map((artistName) => {
              const artistData = comparisonData.insights.artists[artistName];
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
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
