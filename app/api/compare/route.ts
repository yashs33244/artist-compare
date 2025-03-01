import { NextResponse } from "next/server";
import Together from "together-ai";

// Initialize Together AI client
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

// Helper function to get Spotify access token
async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Spotify access token");
  }

  const data = await response.json();
  return data.access_token;
}

// Fetch artist details from Spotify
async function getArtistDetails(artistId, accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch details for artist ${artistId}`);
  }

  return await response.json();
}

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const artistIds = searchParams.get("artists")?.split(",") || [];

  if (artistIds.length === 0) {
    return NextResponse.json(
      { error: "Artist IDs are required" },
      { status: 400 }
    );
  }

  try {
    // Get Spotify access token
    const accessToken = await getSpotifyAccessToken();

    // Fetch details for all artists
    const artistDetails = await Promise.all(
      artistIds.map((id) => getArtistDetails(id, accessToken))
    );

    // Prepare the data for Together AI
    const artistDataForAI = artistDetails.map((artist) => ({
      name: artist.name,
      popularity: artist.popularity,
      followers: artist.followers.total,
      genres: artist.genres.join(", "),
      imageUrl: artist.images[0]?.url || "/placeholder.svg",
    }));

    // Send artist data to Together AI for analysis with a specific prompt for consistent JSON format
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert music industry analyst with deep knowledge of artists' careers, commercial success, and industry impact. 
          
          You need to provide detailed, factual insights in a strictly parseable JSON format. Include source links for all major data points. 
          
          Your response MUST follow this exact format without any markdown or additional text:
          
          {
            "artists": {
              "[artistName]": {
                "net_worth": number,
                "earnings_per_performance": number,
                "career_achievements": {
                  "hits": number,
                  "milestones": "string description"
                },
                "global_influence": number,
                "awards_recognition": number,
                "collaborations": number,
                "genre_impact": number,
                "commercial_success": number,
                "longevity": number,
                "insights": "Detailed paragraph about the artist's career and impact",
                "sources": {
                  "net_worth": "URL",
                  "earnings": "URL",
                  "awards": "URL",
                  "streaming": "URL"
                }
              }
            }
          }
          
          Make sure the entire response is valid JSON without any explanations, markdown or text outside the JSON structure.`
        },
        {
          role: "user",
          content: `Analyze and compare the following artists based on their Spotify data: ${JSON.stringify(
            artistDataForAI
          )}. 
          
          Provide detailed metrics on: 
          - net worth (in millions USD)
          - earnings per performance (in thousands USD)
          - career achievements (number of hits and descriptive milestones)
          - global influence (on a scale of 1-10)
          - awards & recognition (number of awards)
          - collaborations (number of notable collaborations)
          - music genre impact (number of genres influenced)
          - commercial success (total streams in billions)
          - longevity in the industry (years active)
          
          For each artist, also provide:
          1. A detailed paragraph of insights about their career trajectory and industry impact
          2. Source URLs for each major data point (net worth, earnings, awards, streaming numbers)
          
          Format the response as a valid JSON object with the exact structure specified in the system message.`
        },
      ],
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
      max_tokens: 2000,
      temperature: 0.2, // Lower temperature for more consistent responses
      top_p: 0.95,
      top_k: 40,
      repetition_penalty: 1.03,
    });

    // Extract the content from Together AI response
    const aiContent = response.choices[0]?.message?.content || "{}";

    // Parse the JSON response with robust error handling
    let insights = {};
    try {
      // First attempt: try direct parsing
      try {
        insights = JSON.parse(aiContent);
      } catch (initialError) {
        // Second attempt: try to extract JSON from potential markdown or text
        const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          // Clean up any markdown code blocks
          const jsonString = jsonMatch[0].replace(/```json|```/g, '').trim();
          insights = JSON.parse(jsonString);
        } else {
          throw new Error("Could not extract valid JSON");
        }
      }

      // Validate that we have the expected structure
      if (!insights.artists) {
        throw new Error("Missing artists data in response");
      }
    } catch (e) {
      console.error("Error parsing AI response:", e);
      
      // Create a structured fallback response if parsing fails
      const artistNames = artistDataForAI.map(artist => artist.name);
      const fallbackResponse = {
        artists: {}
      };
      
      // Generate fallback data for each artist
      artistNames.forEach(name => {
        fallbackResponse.artists[name] = {
          net_worth: 0,
          earnings_per_performance: 0,
          career_achievements: {
            hits: 0,
            milestones: "Information unavailable"
          },
          global_influence: 0,
          awards_recognition: 0,
          collaborations: 0,
          genre_impact: 0,
          commercial_success: 0,
          longevity: 0,
          insights: "We couldn't retrieve detailed information for this artist.",
          sources: {
            general: "https://www.billboard.com/"
          }
        };
      });
      
      return NextResponse.json({
        artists: artistDataForAI,
        insights: fallbackResponse,
        parsing_error: true,
        raw_content: aiContent.substring(0, 500) + "..." // Include truncated raw content for debugging
      });
    }

    return NextResponse.json({ 
      artists: artistDataForAI, 
      insights: insights,
      spotify_data: artistDetails.map(artist => ({
        name: artist.name,
        popularity: artist.popularity,
        followers: artist.followers.total,
        genres: artist.genres
      }))
    });
  } catch (error) {
    console.error("Error comparing artists:", error);
    return NextResponse.json(
      { error: "Failed to compare artists", details: error.message },
      { status: 500 }
    );
  }
}