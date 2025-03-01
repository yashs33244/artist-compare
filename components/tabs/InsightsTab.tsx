import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export const InsightsTab = ({ comparisonData }) => {
  return (
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
                  generateDefaultInsight(artistName, artistData)}
              </p>

              <div className="mt-6 space-y-2">
                <h4 className="font-medium text-sm">Key Achievements:</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Net worth of ${artistData.net_worth} million</li>
                  <li>
                    Average of ${artistData.earnings_per_performance}K per
                    performance
                  </li>
                  <li>{artistData.awards_recognition} major industry awards</li>
                  <li>
                    {artistData.career_achievements?.hits || "Multiple"}{" "}
                    chart-topping hits
                  </li>
                  <li>{artistData.collaborations} notable collaborations</li>
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
  );
};

// Helper function to generate default insight text
const generateDefaultInsight = (name, data) =>
  `${name} has achieved significant success in the music industry with a net worth of $${
    data.net_worth
  }M and earning approximately $${
    data.earnings_per_performance
  }K per performance. With ${
    data.career_achievements?.hits || "multiple"
  } hit songs and ${
    data.awards_recognition
  } major awards, they've been active for ${
    data.longevity
  } years and have collaborated with ${
    data.collaborations
  } notable artists throughout their career.`;
