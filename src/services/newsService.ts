import { Linking } from 'react-native';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  source: string;
  publishedAt: string;
  category: 'general' | 'politics' | 'religion' | 'education' | 'community';
  location?: {
    country: string;
    city?: string;
    region?: string;
  };
  isLocal?: boolean;
}

// Mock Islamic news data - In a real app, this would come from APIs like NewsAPI, Islamic news sources, etc.
const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Ramadan 2024: Global Muslim Communities Prepare for Holy Month',
    description: 'Muslim communities worldwide are making preparations for the upcoming holy month of Ramadan, with mosques organizing special programs and community events.',
    thumbnail: 'https://images.unsplash.com/photo-1564769626-aa5168ba3f91?w=400&h=250&fit=crop',
    url: 'https://www.islamicrelief.org.uk/ramadan/',
    source: 'Islamic Relief',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    category: 'religion',
    location: { country: 'Global' },
    isLocal: false
  },
  {
    id: '2',
    title: 'New Islamic Center Opens in Downtown Community',
    description: 'A new state-of-the-art Islamic center has opened its doors, providing prayer facilities, educational programs, and community services for local Muslims.',
    thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=250&fit=crop',
    url: 'https://www.muslimmatters.org/',
    source: 'Muslim Matters',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    category: 'community',
    location: { country: 'United States', city: 'New York', region: 'NYC' },
    isLocal: true
  },
  {
    id: '3',
    title: 'Islamic Scholars Gather for Annual Conference on Modern Challenges',
    description: 'Leading Islamic scholars from around the world convened to discuss contemporary issues facing Muslim communities and provide guidance on modern challenges.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    url: 'https://www.islamicfinder.org/',
    source: 'Islamic Finder',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    category: 'education',
    location: { country: 'Saudi Arabia', city: 'Mecca' },
    isLocal: false
  },
  {
    id: '4',
    title: 'Muslim Youth Initiative Launches Digital Learning Platform',
    description: 'A new digital platform has been launched to provide Islamic education and connect Muslim youth worldwide through interactive learning modules.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    url: 'https://www.whyislam.org/',
    source: 'Why Islam',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    category: 'education',
    location: { country: 'Global' },
    isLocal: false
  },
  {
    id: '5',
    title: 'Interfaith Dialogue Strengthens Community Bonds',
    description: 'Local Muslim, Christian, and Jewish communities came together for an interfaith dialogue event, promoting understanding and cooperation.',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=250&fit=crop',
    url: 'https://www.islamicity.org/',
    source: 'IslamiCity',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    category: 'community',
    location: { country: 'United Kingdom', city: 'London' },
    isLocal: false
  },
  {
    id: '6',
    title: 'New Halal Food Certification Program Launched',
    description: 'A comprehensive halal certification program has been introduced to ensure food products meet Islamic dietary requirements and standards.',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
    url: 'https://www.halalfoodauthority.com/',
    source: 'Halal Food Authority',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    category: 'general',
    location: { country: 'Global' },
    isLocal: false
  },
  {
    id: '7',
    title: 'Islamic Art Exhibition Showcases Cultural Heritage',
    description: 'A traveling exhibition of Islamic art and calligraphy is showcasing the rich cultural heritage of Muslim civilizations across different regions.',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop',
    url: 'https://www.metmuseum.org/exhibitions/listings/2023/islamic-art',
    source: 'Metropolitan Museum',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    category: 'general',
    location: { country: 'United States', city: 'New York' },
    isLocal: true
  },
  {
    id: '8',
    title: 'Muslim Women Leadership Summit Addresses Empowerment',
    description: 'The annual Muslim Women Leadership Summit brought together influential women to discuss empowerment, education, and community leadership.',
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=250&fit=crop',
    url: 'https://www.muslimwomensnetwork.org.uk/',
    source: 'Muslim Women\'s Network',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
    category: 'community',
    location: { country: 'United Kingdom', city: 'Birmingham' },
    isLocal: false
  },
  // Additional location-specific news
  {
    id: '9',
    title: 'Local Mosque Hosts Community Food Drive',
    description: 'The downtown Islamic center organized a successful food drive, collecting over 500 meals for families in need during the winter season.',
    thumbnail: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop',
    url: 'https://www.localmosque.org/',
    source: 'Local Islamic Center',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    category: 'community',
    location: { country: 'United States', city: 'New York', region: 'NYC' },
    isLocal: true
  },
  {
    id: '10',
    title: 'Friday Prayer Services Resume at Local Masjid',
    description: 'After renovations, the community mosque has reopened with enhanced facilities and increased capacity for Friday congregational prayers.',
    thumbnail: 'https://images.unsplash.com/photo-1564769626-aa5168ba3f91?w=400&h=250&fit=crop',
    url: 'https://www.localmasjid.org/',
    source: 'Community Masjid',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    category: 'religion',
    location: { country: 'United States', city: 'New York', region: 'NYC' },
    isLocal: true
  },
  {
    id: '11',
    title: 'Islamic School Opens New Campus in Brooklyn',
    description: 'A new Islamic school campus has opened in Brooklyn, offering comprehensive education from kindergarten to high school with Islamic values integration.',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop',
    url: 'https://www.islamicschoolnyc.org/',
    source: 'Islamic Education Network',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    category: 'education',
    location: { country: 'United States', city: 'Brooklyn', region: 'NYC' },
    isLocal: true
  },
  {
    id: '12',
    title: 'Local Muslim Business Association Launches',
    description: 'A new association for Muslim-owned businesses has been established to promote economic growth and networking within the local community.',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    url: 'https://www.muslimbusinessnyc.org/',
    source: 'Muslim Business Network',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
    category: 'community',
    location: { country: 'United States', city: 'New York', region: 'NYC' },
    isLocal: true
  },
  // Additional global news to ensure we always have enough content
  {
    id: '13',
    title: 'Islamic Relief Launches Global Water Initiative',
    description: 'A new global initiative to provide clean water access to communities in need across Africa and Asia has been launched by Islamic Relief.',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    url: 'https://www.islamicrelief.org/water/',
    source: 'Islamic Relief Worldwide',
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9 hours ago
    category: 'community',
    location: { country: 'Global' },
    isLocal: false
  },
  {
    id: '14',
    title: 'Digital Quran Learning Platform Reaches 1 Million Users',
    description: 'A popular digital platform for learning the Quran has reached a milestone of 1 million active users worldwide, promoting Islamic education.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    url: 'https://www.quranlearning.com/',
    source: 'Digital Islamic Education',
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(), // 11 hours ago
    category: 'education',
    location: { country: 'Global' },
    isLocal: false
  },
  {
    id: '15',
    title: 'Muslim Scientists Contribute to Climate Research',
    description: 'Leading Muslim scientists from around the world are contributing to important climate change research and environmental sustainability initiatives.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    url: 'https://www.islamicclimate.org/',
    source: 'Islamic Climate Initiative',
    publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(), // 13 hours ago
    category: 'general',
    location: { country: 'Global' },
    isLocal: false
  }
];

// Cache for storing news articles
let cachedNews: NewsArticle[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const getIslamicNews = async (userLocation?: { country?: string; city?: string; region?: string }): Promise<NewsArticle[]> => {
  const now = Date.now();
  
  // Return cached data if it's still fresh (less than 1 hour old)
  if (cachedNews.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    return filterNewsByLocation(cachedNews, userLocation);
  }

  try {
    // In a real app, you would make API calls here to fetch news from various sources
    // For now, we'll simulate an API call with mock data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Shuffle and return mock data
    const shuffledNews = [...mockNewsArticles].sort(() => Math.random() - 0.5);
    cachedNews = shuffledNews.slice(0, 10); // Return 10 articles for better variety
    lastFetchTime = now;
    
    return filterNewsByLocation(cachedNews, userLocation);
  } catch (error) {
    console.error('Error fetching Islamic news:', error);
    // Return cached data if available, otherwise return empty array
    return cachedNews.length > 0 ? filterNewsByLocation(cachedNews, userLocation) : [];
  }
};

export const openNewsArticle = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error('Cannot open URL:', url);
    }
  } catch (error) {
    console.error('Error opening news article:', error);
  }
};

export const refreshNews = async (userLocation?: { country?: string; city?: string; region?: string }): Promise<NewsArticle[]> => {
  // Force refresh by clearing cache
  cachedNews = [];
  lastFetchTime = 0;
  return await getIslamicNews(userLocation);
};

export const filterNewsByLocation = (news: NewsArticle[], userLocation?: { country?: string; city?: string; region?: string }): NewsArticle[] => {
  if (!userLocation || !userLocation.country) {
    // If no location provided, return a mix of local and global news
    // Ensure we have at least 5 articles
    return news.length >= 5 ? news.slice(0, 6) : news;
  }

  // Prioritize local news first, then regional, then global
  const localNews = news.filter(article => 
    article.isLocal && 
    article.location?.country === userLocation.country &&
    (article.location?.city === userLocation.city || article.location?.region === userLocation.region)
  );

  const countryNews = news.filter(article => 
    article.location?.country === userLocation.country && !article.isLocal
  );

  const globalNews = news.filter(article => 
    article.location?.country === 'Global' || !article.location
  );

  // Combine and prioritize: local first, then country, then global
  const prioritizedNews = [...localNews, ...countryNews, ...globalNews];
  
  // Remove duplicates
  const uniqueNews = prioritizedNews.filter((article, index, self) => 
    index === self.findIndex(a => a.id === article.id)
  );

  // Ensure we have at least 5 articles, fill with remaining news if needed
  if (uniqueNews.length < 5) {
    const remainingNews = news.filter(article => 
      !uniqueNews.some(unique => unique.id === article.id)
    );
    uniqueNews.push(...remainingNews.slice(0, 5 - uniqueNews.length));
  }

  return uniqueNews.slice(0, 6);
};

export const getNewsByCategory = (category: NewsArticle['category']): NewsArticle[] => {
  return cachedNews.filter(article => article.category === category);
};

export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const publishedDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
};

export const getCategoryColor = (category: NewsArticle['category']): string => {
  switch (category) {
    case 'religion':
      return '#2E7D32';
    case 'community':
      return '#1976D2';
    case 'education':
      return '#7B1FA2';
    case 'politics':
      return '#D32F2F';
    case 'general':
    default:
      return '#F57C00';
  }
};

export const getCategoryIcon = (category: NewsArticle['category']): string => {
  switch (category) {
    case 'religion':
      return 'library';
    case 'community':
      return 'people';
    case 'education':
      return 'school';
    case 'politics':
      return 'flag';
    case 'general':
    default:
      return 'newspaper';
  }
};
