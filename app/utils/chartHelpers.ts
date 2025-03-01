  // File: utils/chartHelpers.js - Helper functions for charts
  export const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];
  
  export const formatChartData = (category, artistsData) => {
    return Object.entries(artistsData).map(
      ([name, data], index) => ({
        name,
        value: data[category] || 0,
        color: COLORS[index % COLORS.length],
      })
    );
  };