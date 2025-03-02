export const fetchArtistComparisonData = async (artistIds) => {
    const response = await fetch(
      `/api/compare?artists=${artistIds.join(",")}`
    );
    if (!response.ok) throw new Error("Failed to fetch comparison data");
    const data = await response.json();
  
    if (data.error) {
      throw new Error(data.error);
    }
  
    return data;
  };
  
