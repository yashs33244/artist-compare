"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function GlobalSearch({ onArtistSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        setIsOpen(true);
        try {
          // Call the API route directly instead of using the action
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`
          );
          if (!response.ok) throw new Error("Search failed");
          const data = await response.json();
          setResults(data.results || []);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleSelectArtist = (artist) => {
    if (onArtistSelect) {
      onArtistSelect(artist);
      setQuery("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="search"
          placeholder="Search artists to compare..."
          className="w-full pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </form>
      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute top-full mt-1 w-full rounded-md border bg-background shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : (
            <ul className="max-h-80 overflow-auto py-2">
              {results.map((artist) => (
                <li key={artist.id}>
                  <div className="flex items-center justify-between gap-3 px-4 py-2 hover:bg-muted">
                    <div
                      // href={`/artists/${artist.id}`}
                      className="flex items-center gap-3 flex-1"
                      // onClick={(e) => e.stopPropagation()}
                      onClick={() => handleSelectArtist(artist)}
                    >
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={artist.imageUrl || "/placeholder.svg"}
                          alt={artist.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {artist.genre}
                        </p>
                      </div>
                    </div>
                    {onArtistSelect && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => handleSelectArtist(artist)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
