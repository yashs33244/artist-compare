import {
    DollarSign,
    Music,
    Globe,
    Award,
    Users,
    TrendingUp,
    Calendar,
    Info,
  } from "lucide-react";
  
  // Define the structure of the artist data
  interface ArtistMetrics {
    net_worth: number;
    earnings_per_performance: number;
    career_achievements: {
      hits: number;
      milestones: string;
    };
    global_influence: number;
    awards_recognition: number;
    collaborations: number;
    genre_impact: number;
    longevity: number;
    sources?: {
      net_worth?: string;
      earnings?: string;
      streaming?: string;
      general?: string;
      awards?: string;
    };
  }
  
  // Define the structure of the detailed metrics
  interface DetailedMetric {
    name: string;
    value: string | number;
    icon: JSX.Element;
    source: string | null;
  }
  
  // Define the structure of the artists data object
  interface ArtistsData {
    [key: string]: ArtistMetrics;
  }
  
  export const getDetailedMetrics = (
    artistName: string,
    artistsData: ArtistsData
  ): DetailedMetric[] => {
    const artistData = artistsData[artistName];
    if (!artistData) return [];
  
    return [
      {
        name: "Net Worth",
        value: `$${artistData.net_worth}M`,
        icon: <DollarSign className="h-4 w-4" />,
        source: artistData.sources?.net_worth || null,
      },
      {
        name: "Earnings/Show",
        value: `$${artistData.earnings_per_performance}K`,
        icon: <DollarSign className="h-4 w-4" />,
        source: artistData.sources?.earnings || null,
      },
      {
        name: "Hit Songs",
        value: artistData.career_achievements?.hits || "N/A",
        icon: <Music className="h-4 w-4" />,
        source: artistData.sources?.streaming || null,
      },
      {
        name: "Global Influence",
        value: `${artistData.global_influence}/10`,
        icon: <Globe className="h-4 w-4" />,
        source: artistData.sources?.general || null,
      },
      {
        name: "Awards",
        value: artistData.awards_recognition,
        icon: <Award className="h-4 w-4" />,
        source: artistData.sources?.awards || null,
      },
      {
        name: "Collaborations",
        value: artistData.collaborations,
        icon: <Users className="h-4 w-4" />,
        source: null,
      },
      {
        name: "Genre Impact",
        value: artistData.genre_impact,
        icon: <TrendingUp className="h-4 w-4" />,
        source: null,
      },
      {
        name: "Years Active",
        value: artistData.longevity,
        icon: <Calendar className="h-4 w-4" />,
        source: null,
      },
    ];
  };