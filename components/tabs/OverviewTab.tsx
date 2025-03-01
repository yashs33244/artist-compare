import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Award, Globe, Calendar } from "lucide-react";

export const OverviewTab = ({ comparisonData, setActiveTab }) => {
  return (
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
                <MetricCard
                  icon={<DollarSign className="h-5 w-5 mb-1 text-primary" />}
                  label="Net Worth"
                  value={`$${artistData.net_worth}M`}
                />
                <MetricCard
                  icon={<Award className="h-5 w-5 mb-1 text-primary" />}
                  label="Awards"
                  value={artistData.awards_recognition}
                />
                <MetricCard
                  icon={<Globe className="h-5 w-5 mb-1 text-primary" />}
                  label="Influence"
                  value={`${artistData.global_influence}/10`}
                />
                <MetricCard
                  icon={<Calendar className="h-5 w-5 mb-1 text-primary" />}
                  label="Years Active"
                  value={artistData.longevity}
                />
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Career Highlight:</h4>
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
  );
};

// Reusable metric card component
const MetricCard = ({ icon, label, value }) => (
  <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
    {icon}
    <span className="text-sm font-medium">{label}</span>
    <span className="text-lg font-bold">{value}</span>
  </div>
);
