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

