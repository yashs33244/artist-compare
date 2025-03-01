import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ComparisonForm from "@/components/comparison-form";
import ArtistComparisonResults from "@/components/ArtistComparisonResults";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ComparePage({
  searchParams,
}: {
  searchParams: { artists?: string };
}) {
  const artistIds = searchParams.artists ? searchParams.artists.split(",") : [];

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Compare Artists</h1>
        <p className="mt-2 text-muted-foreground">
          Select artists to compare their metrics across net worth, earnings,
          global influence, awards, collaborations, genre impact, commercial
          success, and longevity
        </p>
      </div>

      <ComparisonForm initialArtistIds={artistIds} />

      {artistIds.length === 0 && (
        <Alert className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select at least one artist to see comparison data
          </AlertDescription>
        </Alert>
      )}

      {artistIds.length === 1 && (
        <Alert className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Select multiple artists to compare them side by side
          </AlertDescription>
        </Alert>
      )}

      {artistIds.length > 1 && (
        <div className="mt-10">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">
                  Loading comprehensive comparison data...
                </span>
              </div>
            }
          >
            <ArtistComparisonResults artistIds={artistIds} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
