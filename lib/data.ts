// Mock data for the application
// In a real application, this would be fetched from a database

export interface Artist {
  id: string
  name: string
  imageUrl: string
  genre: string
  netWorth: number
  monthlyListeners: number
  awards: string[]
  bio: string
  careerStart: number
  earlyIncome: number
  socialMedia: {
    instagram: number
    twitter: number
    youtube: number
  }
  albums: {
    name: string
    year: number
    sales: number
  }[]
  spotifyStats: {
    monthlyListeners: number
    topTracks: {
      name: string
      streams: number
    }[]
    followers: number
    popularity: number
  }
  concertStats: {
    totalConcerts: number
    averageAttendance: number
    averageTicketPrice: number
    grossPerShow: number
    upcomingShows: number
    lastYearRevenue: number
  }
}

const artistsData: Artist[] = [
  {
    id: "1",
    name: "Taylor Swift",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Taylor+Swift",
    genre: "Pop",
    netWorth: 1100000000,
    monthlyListeners: 83000000,
    awards: ["Grammy Award", "Billboard Music Award", "American Music Award", "MTV Video Music Award"],
    bio: "Taylor Swift is an American singer-songwriter known for narrative songs about her personal life. She has become one of the best-selling music artists of all time and her accolades include 11 Grammy Awards.",
    careerStart: 2006,
    earlyIncome: 50000,
    socialMedia: {
      instagram: 261000000,
      twitter: 94000000,
      youtube: 52000000,
    },
    albums: [
      { name: "Taylor Swift", year: 2006, sales: 5500000 },
      { name: "Fearless", year: 2008, sales: 12000000 },
      { name: "1989", year: 2014, sales: 14000000 },
      { name: "Folklore", year: 2020, sales: 2000000 },
    ],
    spotifyStats: {
      monthlyListeners: 83000000,
      topTracks: [
        { name: "Anti-Hero", streams: 1200000000 },
        { name: "Shake It Off", streams: 1000000000 },
        { name: "Blank Space", streams: 950000000 },
      ],
      followers: 95000000,
      popularity: 98,
    },
    concertStats: {
      totalConcerts: 250,
      averageAttendance: 65000,
      averageTicketPrice: 250,
      grossPerShow: 5000000,
      upcomingShows: 50,
      lastYearRevenue: 1200000000,
    },
  },
  {
    id: "2",
    name: "Drake",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Drake",
    genre: "Hip Hop",
    netWorth: 250000000,
    monthlyListeners: 65000000,
    awards: ["Grammy Award", "Billboard Music Award", "BET Award", "American Music Award"],
    bio: "Drake is a Canadian rapper, singer, and actor. He initially gained recognition as an actor on the teen drama television series Degrassi: The Next Generation, before pursuing a career in music.",
    careerStart: 2006,
    earlyIncome: 40000,
    socialMedia: {
      instagram: 128000000,
      twitter: 39000000,
      youtube: 27000000,
    },
    albums: [
      { name: "Thank Me Later", year: 2010, sales: 1800000 },
      { name: "Take Care", year: 2011, sales: 4000000 },
      { name: "Scorpion", year: 2018, sales: 3000000 },
      { name: "Certified Lover Boy", year: 2021, sales: 1500000 },
    ],
    spotifyStats: {
      monthlyListeners: 65000000,
      topTracks: [
        { name: "God's Plan", streams: 900000000 },
        { name: "Hotline Bling", streams: 800000000 },
        { name: "One Dance", streams: 750000000 },
      ],
      followers: 60000000,
      popularity: 95,
    },
    concertStats: {
      totalConcerts: 200,
      averageAttendance: 50000,
      averageTicketPrice: 200,
      grossPerShow: 3000000,
      upcomingShows: 40,
      lastYearRevenue: 800000000,
    },
  },
  {
    id: "3",
    name: "Beyoncé",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Beyonce",
    genre: "R&B",
    netWorth: 500000000,
    monthlyListeners: 48000000,
    awards: ["Grammy Award", "Billboard Music Award", "BET Award", "MTV Video Music Award"],
    bio: "Beyoncé is an American singer, songwriter, and actress. She rose to fame in the late 1990s as the lead singer of Destiny's Child and went on to become one of the best-selling music artists of all time.",
    careerStart: 1997,
    earlyIncome: 35000,
    socialMedia: {
      instagram: 295000000,
      twitter: 15000000,
      youtube: 29000000,
    },
    albums: [
      { name: "Dangerously in Love", year: 2003, sales: 5000000 },
      { name: "B'Day", year: 2006, sales: 3000000 },
      { name: "Lemonade", year: 2016, sales: 2500000 },
      { name: "Renaissance", year: 2022, sales: 1000000 },
    ],
    spotifyStats: {
      monthlyListeners: 48000000,
      topTracks: [
        { name: "Crazy in Love", streams: 700000000 },
        { name: "Single Ladies", streams: 650000000 },
        { name: "Halo", streams: 600000000 },
      ],
      followers: 50000000,
      popularity: 92,
    },
    concertStats: {
      totalConcerts: 180,
      averageAttendance: 45000,
      averageTicketPrice: 220,
      grossPerShow: 4000000,
      upcomingShows: 30,
      lastYearRevenue: 700000000,
    },
  },
  {
    id: "4",
    name: "Ed Sheeran",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Ed+Sheeran",
    genre: "Pop",
    netWorth: 200000000,
    monthlyListeners: 78000000,
    awards: ["Grammy Award", "Brit Award", "Billboard Music Award", "MTV Video Music Award"],
    bio: "Ed Sheeran is an English singer-songwriter. He has sold more than 150 million records worldwide, making him one of the world's best-selling music artists.",
    careerStart: 2004,
    earlyIncome: 20000,
    socialMedia: {
      instagram: 42000000,
      twitter: 19000000,
      youtube: 52000000,
    },
    albums: [
      { name: "+", year: 2011, sales: 4000000 },
      { name: "×", year: 2014, sales: 10000000 },
      { name: "÷", year: 2017, sales: 14000000 },
      { name: "=", year: 2021, sales: 2000000 },
    ],
    spotifyStats: {
      monthlyListeners: 78000000,
      topTracks: [
        { name: "Shape of You", streams: 1500000000 },
        { name: "Thinking Out Loud", streams: 1300000000 },
        { name: "Perfect", streams: 1200000000 },
      ],
      followers: 70000000,
      popularity: 96,
    },
    concertStats: {
      totalConcerts: 220,
      averageAttendance: 60000,
      averageTicketPrice: 180,
      grossPerShow: 3500000,
      upcomingShows: 45,
      lastYearRevenue: 900000000,
    },
  },
  {
    id: "5",
    name: "Billie Eilish",
    imageUrl: "/placeholder.svg?height=400&width=400&text=Billie+Eilish",
    genre: "Pop",
    netWorth: 30000000,
    monthlyListeners: 55000000,
    awards: ["Grammy Award", "Billboard Music Award", "American Music Award", "MTV Video Music Award"],
    bio: "Billie Eilish is an American singer-songwriter. She first gained attention in 2015 when she uploaded the song 'Ocean Eyes' to SoundCloud, which was subsequently released by the Interscope Records subsidiary Darkroom.",
    careerStart: 2015,
    earlyIncome: 15000,
    socialMedia: {
      instagram: 108000000,
      twitter: 7000000,
      youtube: 48000000,
    },
    albums: [
      { name: "When We All Fall Asleep, Where Do We Go?", year: 2019, sales: 3500000 },
      { name: "Happier Than Ever", year: 2021, sales: 1500000 },
    ],
    spotifyStats: {
      monthlyListeners: 55000000,
      topTracks: [
        { name: "bad guy", streams: 1100000000 },
        { name: "lovely", streams: 950000000 },
        { name: "bury a friend", streams: 800000000 },
      ],
      followers: 45000000,
      popularity: 94,
    },
    concertStats: {
      totalConcerts: 150,
      averageAttendance: 40000,
      averageTicketPrice: 150,
      grossPerShow: 2000000,
      upcomingShows: 25,
      lastYearRevenue: 400000000,
    },
  },
  {
    id: "6",
    name: "The Weeknd",
    imageUrl: "/placeholder.svg?height=400&width=400&text=The+Weeknd",
    genre: "R&B",
    netWorth: 200000000,
    monthlyListeners: 75000000,
    awards: ["Grammy Award", "Billboard Music Award", "American Music Award", "Juno Award"],
    bio: "The Weeknd is a Canadian singer, songwriter, and record producer. He is known for his sonic versatility and dark lyricism, his music exploring escapism, romance, and melancholia, and is often inspired by personal experiences.",
    careerStart: 2010,
    earlyIncome: 25000,
    socialMedia: {
      instagram: 55000000,
      twitter: 17000000,
      youtube: 31000000,
    },
    albums: [
      { name: "Kiss Land", year: 2013, sales: 500000 },
      { name: "Beauty Behind the Madness", year: 2015, sales: 3000000 },
      { name: "Starboy", year: 2016, sales: 2000000 },
      { name: "After Hours", year: 2020, sales: 2500000 },
    ],
    spotifyStats: {
      monthlyListeners: 75000000,
      topTracks: [
        { name: "Blinding Lights", streams: 1400000000 },
        { name: "Starboy", streams: 1100000000 },
        { name: "The Hills", streams: 1000000000 },
      ],
      followers: 65000000,
      popularity: 97,
    },
    concertStats: {
      totalConcerts: 210,
      averageAttendance: 55000,
      averageTicketPrice: 210,
      grossPerShow: 4500000,
      upcomingShows: 35,
      lastYearRevenue: 850000000,
    },
  },
]

export async function getFeaturedArtists(): Promise<Artist[]> {
  // In a real application, this would fetch from a database
  // For now, we'll return the first 3 artists from our mock data
  return artistsData.slice(0, 3)
}

export async function getAllArtists(): Promise<Artist[]> {
  // In a real application, this would fetch from a database
  return artistsData
}

export async function getArtistById(id: string): Promise<Artist | undefined> {
  // In a real application, this would fetch from a database
  return artistsData.find((artist) => artist.id === id)
}

export async function getRelatedArtists(id: string, limit = 3): Promise<Artist[]> {
  // In a real application, this would fetch related artists based on genre or other factors
  // For now, we'll just return other artists excluding the current one
  return artistsData.filter((artist) => artist.id !== id).slice(0, limit)
}

