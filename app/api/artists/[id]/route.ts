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

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Artist ID is required" }, { status: 400 });
    }

    // Get Spotify access token
    const accessToken = await getSpotifyAccessToken();

    // Fetch artist details from Spotify API
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch artist details");
    }

    const artist = await response.json();

    // Map Spotify artist data to the expected format
    const artistData = {
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url || "/placeholder.svg",
      genre: artist.genres[0] || "Unknown",
    };

    return NextResponse.json(artistData);
  } catch (error) {
    console.error("Error fetching artist:", error);
    return NextResponse.json({ error: "Failed to fetch artist data" }, { status: 500 });
  }
}