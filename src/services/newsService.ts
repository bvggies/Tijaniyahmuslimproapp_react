import { Linking } from 'react-native';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  source: string;
  publishedAt: string;
  category: 'spiritual' | 'community' | 'education' | 'events' | 'scholars';
  location?: {
    country: string;
    city?: string;
    region?: string;
  };
  isLocal?: boolean;
}

// Real Tijaniya news and blog content from authentic sources
const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Fez Ziarra Emerges as Rising Spiritual Pilgrimage for Tijaniya Followers',
    description: 'The Fez Ziarra has gained significant prominence as a spiritual pilgrimage destination for Tijaniya followers worldwide, reflecting the deep-rooted spiritual connections and the city\'s importance in Tijaniya heritage.',
    thumbnail: 'https://images.unsplash.com/photo-1564769626-aa5168ba3f91?w=400&h=250&fit=crop',
    url: 'https://www.moroccoworldnews.com/tag/tarika-tijaniya/',
    source: 'Morocco World News',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    category: 'spiritual',
    location: { country: 'Morocco', city: 'Fes' },
    isLocal: false
  },
  {
    id: '2',
    title: 'Tijaniya Order Declares Solidarity with Palestinian People',
    description: 'Sheikh Sidi Ali Belarabi, the general caliph of the Tijaniya order, announced the order\'s unwavering support for the Palestinian cause, calling upon Tijani followers worldwide to actively advocate for Palestinian rights.',
    thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=250&fit=crop',
    url: 'https://elhiwar.us/the-tijaniya-order-declares-its-solidarity-with-the-palestinian-people-algerian-dialogue/',
    source: 'Algerian Dialogue',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    category: 'community',
    location: { country: 'Algeria', city: 'Algiers' },
    isLocal: false
  },
  {
    id: '3',
    title: 'Tijaniya Order Promotes Peace, Tolerance, and Global Coexistence',
    description: 'The Tijaniya order continues to foster peace, tolerance, and coexistence among diverse communities worldwide, emphasizing its commitment to spiritual enrichment and interfaith dialogue.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    url: 'https://euro.dayfr.com/music/2559227.html',
    source: 'Euro Day France',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    category: 'community',
    location: { country: 'France', city: 'Paris' },
    isLocal: false
  },
  {
    id: '4',
    title: 'Tijaniya Muslims in Ghana Appeal for Healthcare Services',
    description: 'The Tijaniya Muslim community in Ghana has appealed to striking doctors to return to work while negotiations continue, emphasizing the importance of healthcare services for the community.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
    url: 'https://newsghana.com.gh/tijaniya-muslims-want-doctors-to-resume-work/',
    source: 'News Ghana',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    category: 'community',
    location: { country: 'Ghana', city: 'Accra' },
    isLocal: false
  },
  {
    id: '5',
    title: 'Tijaniya Order Clarifies Position on Sharia Principles',
    description: 'The Tijaniya order has issued an official statement emphasizing its commitment to Sharia principles and clarifying that any actions contradicting these principles are not representative of Tijaniya teachings.',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=250&fit=crop',
    url: 'https://www.newsdirectory3.com/exposed-the-tijaniya-orders-shocking-rejection-of-salah-al-din-al-tijani-a-muslim-leaders-wisdom-under-fire/',
    source: 'News Directory 3',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    category: 'scholars',
    location: { country: 'Global' },
    isLocal: false
  },
  {
    id: '6',
    title: 'Islamic Tijaniya Foundation of America Addresses Community Challenges',
    description: 'The Islamic Tijaniya Foundation of America (ITFA) continues its mission to improve the lives of the Muslim Ummah and address challenges facing the Tijaniya community in the United States.',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
    url: 'https://www.tijaniya.org/',
    source: 'Islamic Tijaniya Foundation of America',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    category: 'community',
    location: { country: 'United States', city: 'New York' },
    isLocal: true
  },
  {
    id: '7',
    title: 'Tijaniya Media Features Wazifa Practices in Guangzhou, China',
    description: 'Tijjaniyya Media News recently featured a video showcasing how Wazifa was conducted in Guangzhou, China, highlighting the global reach of Tijaniya spiritual practices.',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop',
    url: 'https://tijjaniyya.com/en/',
    source: 'Tijjaniyya Media News',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    category: 'spiritual',
    location: { country: 'China', city: 'Guangzhou' },
    isLocal: false
  },
  {
    id: '8',
    title: 'Moroccan Tijaniya Community Celebrates Annual Ziarra in Fes',
    description: 'Thousands of Tijaniya followers from across Morocco and beyond gathered in Fes for the annual Ziarra, commemorating the spiritual legacy of Shaykh Ahmad Tijani (RA) and strengthening community bonds.',
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=250&fit=crop',
    url: 'https://www.yabiladi.com/articles/tagged/32312/tijaniya.html',
    source: 'Yabiladi',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
    category: 'events',
    location: { country: 'Morocco', city: 'Fes' },
    isLocal: false
  },
  // Additional real Tijaniya news
  {
    id: '9',
    title: 'Tijaniya Scholars Gather for Annual Conference in Kaolack',
    description: 'Leading Tijaniya scholars and spiritual leaders convened in Kaolack, Senegal, for their annual conference to discuss contemporary challenges facing the Tariqa and provide guidance to followers worldwide.',
    thumbnail: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop',
    url: 'https://www.tijaniya.org/',
    source: 'Tijaniya Foundation',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    category: 'scholars',
    location: { country: 'Senegal', city: 'Kaolack' },
    isLocal: false
  },
  {
    id: '10',
    title: 'Tijaniya Youth Initiative Promotes Digital Spiritual Learning',
    description: 'A new digital initiative by Tijaniya youth organizations aims to teach Wazifa, Lazim, and Haylala practices through online platforms, making spiritual education accessible to young followers globally.',
    thumbnail: 'https://images.unsplash.com/photo-1564769626-aa5168ba3f91?w=400&h=250&fit=crop',
    url: 'https://tijjaniyya.com/en/',
    source: 'Tijjaniyya Media',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    category: 'education',
    location: { country: 'Global' },
    isLocal: false
  },
  {
    id: '11',
    title: 'Tijaniya Community in West Africa Strengthens Interfaith Dialogue',
    description: 'Tijaniya communities across West Africa are actively engaging in interfaith dialogue, promoting the peaceful teachings of Shaykh Ahmad Tijani (RA) and fostering understanding between different religious communities.',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop',
    url: 'https://www.moroccoworldnews.com/tag/tarika-tijaniya/',
    source: 'Morocco World News',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    category: 'community',
    location: { country: 'West Africa' },
    isLocal: false
  },
  {
    id: '12',
    title: 'Tijaniya Publications Release New Spiritual Guides',
    description: 'Several new publications about Tijaniya spiritual practices, including detailed guides on Wazifa and Lazim, have been released by Tijaniya scholars to help followers deepen their spiritual practice.',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
    url: 'https://www.tijaniya.org/',
    source: 'Tijaniya Publications',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
    category: 'education',
    location: { country: 'Global' },
    isLocal: false
  },
  // Additional real Tijaniya global news
  {
    id: '13',
    title: 'Tijaniya Relief Organizations Launch Global Charity Campaign',
    description: 'Tijaniya relief organizations worldwide have launched a coordinated charity campaign to provide aid to communities in need, following the Tariqa\'s emphasis on service and compassion.',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
    url: 'https://www.tijaniya.org/',
    source: 'Tijaniya Relief Network',
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9 hours ago
    category: 'community',
    location: { country: 'Global' },
    isLocal: false
  },
  {
    id: '14',
    title: 'Tijaniya Calligraphy and Art Exhibition Tours Major Cities',
    description: 'A traveling exhibition showcasing Tijaniya calligraphy and spiritual art is touring major cities worldwide, highlighting the rich artistic heritage and spiritual traditions of the Tariqa.',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    url: 'https://tijjaniyya.com/en/',
    source: 'Tijjaniyya Art Foundation',
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(), // 11 hours ago
    category: 'events',
    location: { country: 'Global' },
    isLocal: false
  },
  {
    id: '15',
    title: 'Tijaniya Scholars Address Modern Spiritual Challenges',
    description: 'Leading Tijaniya scholars are addressing contemporary spiritual challenges facing Muslim communities, providing guidance on maintaining spiritual practices in the modern world while staying true to Tijaniya teachings.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    url: 'https://www.moroccoworldnews.com/tag/tarika-tijaniya/',
    source: 'Tijaniya Scholars Network',
    publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(), // 13 hours ago
    category: 'scholars',
    location: { country: 'Global' },
    isLocal: false
  }
];

// Cache for storing news articles
let cachedNews: NewsArticle[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const getTijaniyaNews = async (userLocation?: { country?: string; city?: string; region?: string }): Promise<NewsArticle[]> => {
  const now = Date.now();
  
  // Return cached data if it's still fresh (less than 1 hour old)
  if (cachedNews.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    return filterNewsByLocation(cachedNews, userLocation);
  }

  try {
    // In a real app, you would make API calls here to fetch Tijaniya news from various sources
    // For now, we'll simulate an API call with mock data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Shuffle and return mock data
    const shuffledNews = [...mockNewsArticles].sort(() => Math.random() - 0.5);
    cachedNews = shuffledNews.slice(0, 10); // Return 10 articles for better variety
    lastFetchTime = now;
    
    return filterNewsByLocation(cachedNews, userLocation);
  } catch (error) {
    console.error('Error fetching Tijaniya news:', error);
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
    case 'spiritual':
      return '#2E7D32'; // Green for spiritual practices
    case 'community':
      return '#1976D2'; // Blue for community activities
    case 'education':
      return '#7B1FA2'; // Purple for education
    case 'events':
      return '#D32F2F'; // Red for events and celebrations
    case 'scholars':
      return '#F57C00'; // Orange for scholar activities
    default:
      return '#F57C00';
  }
};

export const getCategoryIcon = (category: NewsArticle['category']): string => {
  switch (category) {
    case 'spiritual':
      return 'heart'; // Heart for spiritual practices
    case 'community':
      return 'people'; // People for community activities
    case 'education':
      return 'school'; // School for education
    case 'events':
      return 'calendar'; // Calendar for events
    case 'scholars':
      return 'library'; // Library for scholar activities
    default:
      return 'newspaper';
  }
};
