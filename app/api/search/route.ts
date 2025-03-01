import { NextResponse } from "next/server";

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

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Get Spotify access token
    const accessToken = await getSpotifyAccessToken();

    // Search for artists using Spotify API
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Spotify search failed");
    }

    const data = await response.json();

    // Map Spotify search results to artist objects
    const artists = data.artists?.items.map((artist) => ({
      id: artist.id, // Use Spotify ID
      name: artist.name,
      imageUrl: artist.images[0]?.url || "/placeholder.svg", // Use the first image if available
      genre: artist.genres[0] || "Unknown", // Use the first genre if available
    })) || [];

    return NextResponse.json({ results: artists });
  } catch (error) {
    console.error("Error searching for artists:", error);
    return NextResponse.json({ results: [] });
  }
}