"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlobalSearch from "@/components/global-search";
import Image from "next/image";

export default function ComparisonForm({ initialArtistIds = [] }) {
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(initialArtistIds.length > 0);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch initial artists when initialArtistIds changes
  useEffect(() => {
    const fetchInitialArtists = async () => {
      if (initialArtistIds.length > 0) {
        try {
          setIsLoading(true);
          setError(null);

          // Fetch artist data for each ID
          const promises = initialArtistIds.map((id) =>
            fetch(`/api/artists/${id}`).then((res) => {
              if (!res.ok)
                throw new Error(`Failed to fetch artist with ID: ${id}`);
              return res.json();
            })
          );

          const artists = await Promise.all(promises);
          setSelectedArtists(artists.filter((artist) => artist && artist.id));
        } catch (error) {
          console.error("Failed to fetch initial artists:", error);
          // setError(
          //   "Some artists could not be loaded. Please try again or select different artists."
          // );
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchInitialArtists();
  }, [initialArtistIds]); // Re-run when initialArtistIds changes

  const handleArtistSelect = (artist) => {
    if (artist && artist.preventDefault) {
      artist.preventDefault();
    }

    const artistData = artist.artist || artist;

    if (
      artistData &&
      artistData.id &&
      !selectedArtists.some((a) => a.id === artistData.id)
    ) {
      const updatedArtists = [...selectedArtists, artistData];
      setSelectedArtists(updatedArtists);
      updateURL(updatedArtists);
    }
  };

  const removeArtist = (artistId) => {
    const updatedArtists = selectedArtists.filter(
      (artist) => artist.id !== artistId
    );
    setSelectedArtists(updatedArtists);
    updateURL(updatedArtists);
  };

  const updateURL = (artists) => {
    if (artists.length === 0) {
      router.push("/compare", undefined, { shallow: true });
    } else {
      const ids = artists
        .map((artist) => encodeURIComponent(artist.id))
        .join(",");
      router.push(`/compare${ids ? `?artists=${ids}` : ""}`, undefined, {
        shallow: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GlobalSearch onArtistSelect={handleArtistSelect} />
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedArtists([]);
              updateURL([]);
            }}
            disabled={selectedArtists.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Selected Artists</h2>
          {selectedArtists.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedArtists.length}{" "}
              {selectedArtists.length === 1 ? "artist" : "artists"} selected
            </span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-3 text-amber-800 bg-amber-50 rounded-md border border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center p-8 border border-dashed rounded-md bg-muted/50">
            <div className="text-muted-foreground">
              Loading selected artists...
            </div>
          </div>
        ) : selectedArtists.length === 0 ? (
          <div className="flex items-center justify-center p-8 border border-dashed rounded-md bg-muted/50">
            <div className="text-center text-muted-foreground">
              <p>No artists selected.</p>
              <p className="text-sm mt-1">
                Use the search box above to find and select artists to compare.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedArtists.map((artist) => (
              <div
                key={artist.id}
                className="flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="h-10 w-10 overflow-hidden rounded-full shrink-0">
                  <Image
                    src={artist.imageUrl || "/placeholder.svg"}
                    alt={artist.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{artist.name}</p>
                  {artist.genres && artist.genres.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate">
                      {artist.genres.slice(0, 2).join(", ")}
                      {artist.genres.length > 2 && "..."}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeArtist(artist.id)}
                  aria-label={`Remove ${artist.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
