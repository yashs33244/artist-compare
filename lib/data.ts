// Functions to interact with our API

export async function getAllArtists() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artists`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch artists");
    }
    
    const data = await response.json();
    return data.artists;
  } catch (error) {
    console.error("Error fetching all artists:", error);
    return [];
  }
}

export async function getArtistById(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artists/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching artist ${id}:`, error);
    return null;
  }
}

export async function getRelatedArtists(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artists/${id}/related`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch related artists");
    }
    
    const data = await response.json();
    return data.artists;
  } catch (error) {
    console.error(`Error fetching related artists for ${id}:`, error);
    return [];
  }
}

export async function compareArtists(ids: string[]) {
  try {
    const idString = ids.join(",");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/compare?artists=${idString}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to compare artists");
    }
    
    const data = await response.json();
    return data.artists;
  } catch (error) {
    console.error("Error comparing artists:", error);
    return [];
  }
}