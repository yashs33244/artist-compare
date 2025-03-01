export interface ArtistData {
    name: string;
    popularity: number;
    followers: number;
    genres: string;
    imageUrl: string;
  }
  
  export interface ArtistMetrics {
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
    commercial_success: number;
    longevity: number;
    insights?: string;
    sources?: {
      net_worth?: string;
      earnings?: string;
      awards?: string;
      streaming?: string;
      general?: string;
      [key: string]: string | undefined;
    };
  }
  
  export interface ComparisonData {
    artists: ArtistData[];
    insights: {
      artists: {
        [key: string]: ArtistMetrics;
      };
    };
    spotify_data?: {
      name: string;
      popularity: number;
      followers: number;
      genres: string[];
    }[];
    parsing_error?: boolean;
    raw_content?: string;
  }
  