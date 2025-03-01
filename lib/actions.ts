"use server"
import { deepseek } from "@ai-sdk/deepseek"
import { generateText } from "ai"
import { getAllArtists } from "./data"
import Together from "together-ai"

// Initialize Together AI client
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
})

export async function getArtistInsights(artistName: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: deepseek("deepseek-reasoner"),
      messages: [
        {
          role: "system",
          content: "You are an expert music industry analyst. Provide concise, factual insights about artists.",
        },
        {
          role: "user",
          content: `Analyze ${artistName}'s career success, focusing on commercial performance, artistic impact, and industry influence. Include insights about their financial growth and market presence. Keep it concise (150 words max).`,
        },
      ],
    })
    return text
  } catch (error) {
    console.error("Error generating artist insights:", error)
    return "We couldn't generate insights for this artist at the moment. Please try again later."
  }
}

export async function getAIArtistComparison(artistIds: string[]): Promise<any> {
  try {
    // Get artist names from IDs
    const allArtists = await getAllArtists()
    const selectedArtists = allArtists.filter((artist) => artistIds.includes(artist.id))
    
    if (selectedArtists.length === 0) {
      throw new Error("No valid artists found for comparison")
    }
    
    // For each artist, get AI-generated insights
    const artistInsights = await Promise.all(
      selectedArtists.map(async (artist) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist-insights`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ artistName: artist.name }),
          })
          
          if (!response.ok) {
            throw new Error(`Failed to fetch insights for ${artist.name}`)
          }
          
          const data = await response.json()
          return {
            artistId: artist.id,
            artistName: artist.name,
            insights: data.insights || {},
          }
        } catch (error) {
          console.error(`Error fetching insights for ${artist.name}:`, error)
          return {
            artistId: artist.id,
            artistName: artist.name,
            insights: {
              summary: `We couldn't generate detailed insights for ${artist.name} at this time.`
            },
          }
        }
      })
    )
    
    // Process and structure the data for comparison
    const formattedData = {
      artists: selectedArtists.map(artist => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.imageUrl || "/placeholder.svg",
      })),
      
      metrics: {
        netWorth: selectedArtists.map((artist, index) => {
          const insights = artistInsights[index]?.insights || {}
          const netWorthRaw = insights.netWorth || "Unknown"
          let netWorthValue = 0
          
          if (typeof netWorthRaw === 'string') {
            // Extract number from text like "$150 million" or "150M USD"
            const match = netWorthRaw.match(/(\d+(?:\.\d+)?)/g)
            if (match) netWorthValue = parseFloat(match[0])
          } else if (typeof netWorthRaw === 'number') {
            netWorthValue = netWorthRaw
          } else if (netWorthRaw.value && typeof netWorthRaw.value === 'number') {
            netWorthValue = netWorthRaw.value
          }
          
          return {
            name: artist.name,
            value: netWorthValue,
            formattedValue: `$${netWorthValue}M`
          }
        }),
        
        earningsPerShow: selectedArtists.map((artist, index) => {
          const insights = artistInsights[index]?.insights || {}
          const earningsRaw = insights.earningsPerPerformance || "Unknown"
          let earningsValue = 0
          
          if (typeof earningsRaw === 'string') {
            const match = earningsRaw.match(/(\d+(?:\.\d+)?)/g)
            if (match) earningsValue = parseFloat(match[0]) * 1000 // Assuming in thousands
          } else if (typeof earningsRaw === 'number') {
            earningsValue = earningsRaw
          } else if (earningsRaw.value && typeof earningsRaw.value === 'number') {
            earningsValue = earningsRaw.value
          }
          
          return {
            name: artist.name,
            value: earningsValue,
            formattedValue: `$${earningsValue.toLocaleString()}`
          }
        }),
        
        globalInfluence: selectedArtists.map((artist, index) => {
          const insights = artistInsights[index]?.insights || {}
          const influenceRaw = insights.globalInfluence || "Unknown"
          let description = typeof influenceRaw === 'string' ? 
                           influenceRaw : 
                           (influenceRaw.description || `${artist.name}'s global influence includes their impact on music trends worldwide.`)
          
          // Assign an influence score (1-10) based on text analysis or default to 7
          let score = 7
          if (description.toLowerCase().includes('legendary') || description.toLowerCase().includes('icon')) score = 10
          else if (description.toLowerCase().includes('significant') || description.toLowerCase().includes('major')) score = 9
          else if (description.toLowerCase().includes('notable') || description.toLowerCase().includes('important')) score = 8
          else if (description.toLowerCase().includes('growing') || description.toLowerCase().includes('emerging')) score = 6
          
          return {
            name: artist.name,
            value: score,
            description: description.slice(0, 300) // Limit length
          }
        }),
        
        awards: selectedArtists.map((artist, index) => {
          const insights = artistInsights[index]?.insights || {}
          const awardsRaw = insights.awardsRecognition || "Unknown"
          
          let majorAwards = []
          if (typeof awardsRaw === 'string') {
            // Extract award names from text
            majorAwards = awardsRaw
              .split(/[,.;\n]/)
              .map(s => s.trim())
              .filter(s => s.length > 3 && s.toLowerCase().includes('award') || s.toLowerCase().includes('grammy') || s.toLowerCase().includes('prize'))
              .slice(0, 5)
          } else if (Array.isArray(awardsRaw)) {
            majorAwards = awardsRaw.slice(0, 5)
          } else if (awardsRaw.list && Array.isArray(awardsRaw.list)) {
            majorAwards = awardsRaw.list.slice(0, 5)
          }
          
          // Fallback if no awards found
          if (majorAwards.length === 0) {
            majorAwards = [`Information about ${artist.name}'s awards is limited`]
          }
          
          return {
            name: artist.name,
            value: majorAwards.length,
            majorAwards
          }
        }),
        
        collaborations: selectedArtists.map((artist, index) => {
          const insights = artistInsights[index]?.insights || {}
          const collaborationsRaw = insights.collaborations || "Unknown"
          
          let notable = []
          if (typeof collaborationsRaw === 'string') {
            notable = collaborationsRaw
              .split(/[,.;\n]/)
              .map(s => s.trim())
              .filter(s => s.length > 3 && !s.toLowerCase().includes('collaborated with'))
              .slice(0, 5)
          } else if (Array.isArray(collaborationsRaw)) {
            notable = collaborationsRaw.slice(0, 5)
          } else if (collaborationsRaw.notable && Array.isArray(collaborationsRaw.notable)) {
            notable = collaborationsRaw.notable.slice(0, 5)
          }
          
          if (notable.length === 0) {
            notable = [`Information about ${artist.name}'s collaborations is limited`]
          }
          
          return {
            name: artist.name,
            value: notable.length,
            notable
          }
        }),
        
        genreImpact: selectedArtists.map((artist, index) => {
          const insights = artistInsights[index]?.insights || {}
          const genreImpactRaw = insights.musicGenreImpact || "Unknown"
          
          let genres = []
          let description = ""
          
          if (typeof genreImpactRaw === 'string') {
            description = genreImpactRaw
            // Extract genres
            const genreMatches = genreImpactRaw.match(/(?:rock|pop|hip[- ]hop|r&b|jazz|country|edm|electronic|folk|classical|metal|punk|reggae|blues|indie)/gi)
            genres = genreMatches ? [...new Set(genreMatches.map(g => g.toLowerCase()))] : []
          } else if (genreImpactRaw.genres && Array.isArray(genreImpactRaw.genres)) {
            genres = genreImpactRaw.genres
            description = genreImpactRaw.description || `${artist.name} has made contributions to ${genres.join(', ')}.`
          }
          
          if (genres.length === 0) {
            genres = ['Unknown']
          }
          
          return {
            name: artist.name,
            value: genres.length,
            genres,
            description: description.slice(0, 200)
          }
        }),
        
        commercialSuccess: selectedArtists.map((artist, index) => {
          const insights = artistInsights[index]?.insights || {}
          const commercialRaw = insights.commercialSuccess || "Unknown"
          
          // Default values
          let albumsSold = 0
          let singlesSold = 0
          let streamingNumbers = 0
          
          // Try to extract numbers from text or object
          if (typeof commercialRaw === 'string') {
            const albumMatch = commercialRaw.match(/(\d+(?:\.\d+)?)\s*(?:million|M)?\s*albums?/i)
            const singleMatch = commercialRaw.match(/(\d+(?:\.\d+)?)\s*(?:million|M)?\s*singles?/i)
            const streamMatch = commercialRaw.match(/(\d+(?:\.\d+)?)\s*(?:billion|B|million|M)?\s*streams?/i)
            
            if (albumMatch) albumsSold = parseFloat(albumMatch[1])
            if (singleMatch) singlesSold = parseFloat(singleMatch[1])
            if (streamMatch) {
              streamingNumbers = parseFloat(streamMatch[1])
              if (streamMatch[0].toLowerCase().includes('billion')) streamingNumbers *= 1000
            }
          } else if (typeof commercialRaw === 'object') {
            albumsSold = commercialRaw.albumsSold || commercialRaw.albums || 0
            singlesSold = commercialRaw.singlesSold || commercialRaw.singles || 0
            streamingNumbers = commercialRaw.streamingNumbers || commercialRaw.streams || 0
          }
          
          const total = albumsSold + singlesSold + (streamingNumbers / 1000)
          
          return {
            name: artist.name,
            albumsSold,
            singlesSold,
            streamingNumbers,
            formattedTotal: `${total.toFixed(1)}M`
          }
        }),
        
        longevity: selectedArtists.map((artist, index) => {
          const insights = artistInsights[index]?.insights || {}
          const longevityRaw = insights.longevity || "Unknown"
          
          let yearsActive = 0
          let careerStart = 0
          let peakYears = ""
          
          if (typeof longevityRaw === 'string') {
            // Try to extract career start year
            const yearMatch = longevityRaw.match(/(?:since|from|in|began in)\s*(\d{4})/i)
            if (yearMatch) {
              careerStart = parseInt(yearMatch[1])
              yearsActive = new Date().getFullYear() - careerStart
            } else {
              // Just try to find any year
              const anyYearMatch = longevityRaw.match(/\d{4}/)
              if (anyYearMatch) {
                careerStart = parseInt(anyYearMatch[0])
                yearsActive = new Date().getFullYear() - careerStart
              }
            }
            
            // Try to extract peak years
            const peakMatch = longevityRaw.match(/peak(?:\s*years?|\s*period|\s*era)?\s*(?:was|were|in)?\s*(?:the)?\s*([^\.]+)/i)
            if (peakMatch) {
              peakYears = peakMatch[1].trim()
            }
          } else if (typeof longevityRaw === 'object') {
            careerStart = longevityRaw.careerStart || 0
            yearsActive = longevityRaw.yearsActive || 0
            peakYears = longevityRaw.peakYears || ""
          }
          
          // Fallbacks
          if (yearsActive === 0 && careerStart > 0) {
            yearsActive = new Date().getFullYear() - careerStart
          } else if (yearsActive === 0 && careerStart === 0) {
            // Default to 10 years if we couldn't determine anything
            yearsActive = 10
          }
          
          if (!peakYears) {
            peakYears = "Information not available"
          }
          
          return {
            name: artist.name,
            yearsActive,
            careerStart,
            peakYears
          }
        })
      },
      
      insights: artistInsights.map(insight => ({
        artistName: insight.artistName,
        summary: typeof insight.insights === 'string' ? 
                insight.insights : 
                (insight.insights.summary || `${insight.artistName} has made significant contributions to the music industry.`)
      }))
    }
    
    return formattedData
  } catch (error) {
    console.error("Error in getAIArtistComparison:", error)
    throw new Error("Failed to compare artists. Please try again.")
  }
}

export async function compareArtists(artistIds: string[]): Promise<any> {
  const allArtists = await getAllArtists()
  const selectedArtists = allArtists.filter((artist) => artistIds.includes(artist.id))
  return {
    artists: selectedArtists,
    comparisonPoints: {
      netWorth: selectedArtists.map((artist) => ({
        name: artist.name,
        value: artist.netWorth,
        formattedValue: `$${(artist.netWorth / 1000000).toFixed(1)}M`,
      })),
      monthlyListeners: selectedArtists.map((artist) => ({
        name: artist.name,
        value: artist.monthlyListeners,
        formattedValue: `${(artist.monthlyListeners / 1000000).toFixed(1)}M`,
      })),
      socialMedia: selectedArtists.map((artist) => ({
        name: artist.name,
        instagram: artist.socialMedia?.instagram || 0,
        twitter: artist.socialMedia?.twitter || 0,
        youtube: artist.socialMedia?.youtube || 0,
        total: (artist.socialMedia?.instagram || 0) + (artist.socialMedia?.twitter || 0) + (artist.socialMedia?.youtube || 0),
        formattedTotal: `${(((artist.socialMedia?.instagram || 0) + (artist.socialMedia?.twitter || 0) + (artist.socialMedia?.youtube || 0)) / 1000000).toFixed(1)}M`,
      })),
      careerLength: selectedArtists.map((artist) => ({
        name: artist.name,
        value: new Date().getFullYear() - (artist.careerStart || 2010),
        formattedValue: `${new Date().getFullYear() - (artist.careerStart || 2010)} years`,
      })),
      awards: selectedArtists.map((artist) => ({
        name: artist.name,
        value: artist.awards?.length || 0,
        formattedValue: (artist.awards?.length || 0).toString(),
      })),
      spotifyMetrics: selectedArtists.map((artist) => ({
        name: artist.name,
        monthlyListeners: artist.spotifyStats?.monthlyListeners || 0,
        followers: artist.spotifyStats?.followers || 0,
        popularity: artist.spotifyStats?.popularity || 0,
        formattedListeners: `${(artist.spotifyStats?.monthlyListeners / 1000000).toFixed(1)}M`,
        formattedFollowers: `${(artist.spotifyStats?.followers / 1000000).toFixed(1)}M`,
        formattedPopularity: `${artist.spotifyStats?.popularity || 0}/100`,
      })),
    },
  }
}