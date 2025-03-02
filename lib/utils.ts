import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateScore(artist: any): number {
  // Calculate a score based on various metrics
  const netWorthScore = Math.log10(artist.netWorth) * 10
  const fameScore = (artist.monthlyListeners / 1000000) * 20
  const awardsScore = artist.awards.length * 5

  return Math.round(netWorthScore + fameScore + awardsScore)
}


// Format large numbers
export function formatNumber(value: number) {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

// Calculate career length
export function calculateCareerLength(startYear: number) {
  const currentYear = new Date().getFullYear();
  return currentYear - startYear;
}
// Generate a random color from a fixed palette
export function getColorForArtist(artistId: string) {
  const colors = [
    "#3B82F6", // blue-500
    "#10B981", // emerald-500
    "#8B5CF6", // violet-500
    "#F59E0B", // amber-500
    "#EF4444", // red-500
    "#EC4899", // pink-500
    "#6366F1", // indigo-500
    "#14B8A6", // teal-500
    "#F97316", // orange-500
    "#8B5CF6", // violet-500
  ];
  
  // Use the sum of character codes to select a color
  const charSum = artistId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charSum % colors.length];
}