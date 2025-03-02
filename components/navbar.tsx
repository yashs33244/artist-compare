"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Music, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import GlobalSearch from "./global-search";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleArtistSelect = (artist) => {
    // Navigate to the compare page with the selected artist's ID
    router.push(`/compare?artists=${encodeURIComponent(artist.id)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ArtistCompare</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block w-72">
            <GlobalSearch onArtistSelect={handleArtistSelect} />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <div className="mb-4">
            <GlobalSearch onArtistSelect={handleArtistSelect} />
          </div>
        </div>
      )}
    </header>
  );
}
