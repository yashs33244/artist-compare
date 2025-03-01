"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { getArtistInsights } from "@/lib/actions"

interface ArtistInsightsProps {
  artistName: string
}

export default function ArtistInsights({ artistName }: ArtistInsightsProps) {
  const [insights, setInsights] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true)
        const insightsText = await getArtistInsights(artistName)
        setInsights(insightsText)
        setError(null)
      } catch (err) {
        console.error("Error fetching artist insights:", err)
        setError("Failed to load insights. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [artistName])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Generating insights...</span>
      </div>
    )
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <p>{insights}</p>
    </div>
  )
}

