"use client";

import { useState, useEffect } from "react";

export default function ArtistInsights({ artistName }: { artistName: string }) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch insights from your API
    const fetchInsights = async () => {
      try {
        setLoading(true);

        // Call your API endpoint to generate insights
        const response = await fetch(
          `/api/insights?artistName=${encodeURIComponent(artistName)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch insights");
        }

        const data = await response.json();
        setInsights(data.insights); // Assuming the API returns { insights: string[] }
      } catch (error) {
        console.error("Error fetching insights:", error);
        setInsights([
          `We couldn't generate insights for ${artistName} at this time.`,
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [artistName]);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">Generating insights...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
