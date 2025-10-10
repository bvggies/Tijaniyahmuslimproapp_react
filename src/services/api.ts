import Constants from 'expo-constants';

export const API_URL: string =
  ((Constants.expoConfig?.extra as any)?.API_URL as string) ||
  'https://tijaniyahmuslimproappreact-production-1e25.up.railway.app';

let accessToken: string | null = null;
export const setToken = (token: string | null) => {
  accessToken = token;
};

export const clearToken = () => {
  accessToken = null;
};

export const getToken = () => accessToken;

export const isAuthenticated = () => !!accessToken;

export const ensureAuthenticated = async () => {
  if (!accessToken) {
    throw new Error('Not authenticated. Please sign in.');
  }
  return true;
};

export const reAuthenticate = async (email: string, password: string) => {
  try {
    const data = await http('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data?.accessToken) {
      setToken(data.accessToken);
      console.log('✅ Re-authentication successful');
      return true;
    }
    return false;
  } catch (error) {
    console.log('❌ Re-authentication failed:', error);
    return false;
  }
};

async function http(path: string, init: RequestInit = {}, retryCount = 0): Promise<any> {
  const maxRetries = 2;
  const retryDelay = 1000; // 1 second
  
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  
  console.log(`🌐 API Request: ${init.method || 'GET'} ${API_URL}${path}${retryCount > 0 ? ` (retry ${retryCount})` : ''}`);
  if (init.body) console.log('📤 Request body:', init.body);
  
  try {
    const res = await fetch(`${API_URL}${path}`, { ...init, headers });
    
    console.log(`📥 Response: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('❌ API Error:', text || `HTTP ${res.status}`);
      
      // Clear token on 401 errors
      if (res.status === 401) {
        console.log('🔐 Clearing token due to 401 error');
        accessToken = null;
      }
      
      // Retry on 502 errors (Railway intermittent issues)
      if (res.status === 502 && retryCount < maxRetries) {
        console.log(`🔄 Retrying in ${retryDelay}ms due to 502 error...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return http(path, init, retryCount + 1);
      }
      
      throw new Error(text || `HTTP ${res.status}`);
    }
    
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return res.json();
    return res.text();
  } catch (error: any) {
    // Retry on network errors
    if (retryCount < maxRetries && (error.message?.includes('Network') || error.message?.includes('fetch'))) {
      console.log(`🔄 Retrying in ${retryDelay}ms due to network error...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return http(path, init, retryCount + 1);
    }
    throw error;
  }
}

export const api = {
  // Health
  health: () => http('/health'),

  // Auth
  signup: (email: string, password: string, name?: string) =>
    http('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  login: async (email: string, password: string) => {
    const data = await http('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data?.accessToken) setToken(data.accessToken);
    return data;
  },

  // Community
  listPosts: (limit = 20, cursor?: string) =>
    http(`/posts?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
  createPost: (content: string, mediaUrls: string[] = []) =>
    http('/posts', { method: 'POST', body: JSON.stringify({ content, mediaUrls }) }),
  getPost: (id: string) => http(`/posts/${encodeURIComponent(id)}`),
  addComment: (id: string, content: string) =>
    http(`/posts/${encodeURIComponent(id)}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
  likePost: (id: string) => http(`/posts/${encodeURIComponent(id)}/like`, { method: 'POST' }),
  unlikePost: (id: string) => http(`/posts/${encodeURIComponent(id)}/like`, { method: 'DELETE' }),

  // Journal
  listJournal: () => http('/journal'),
  createJournal: (title: string, content: string, tags: string[] = []) =>
    http('/journal', { method: 'POST', body: JSON.stringify({ title, content, tags }) }),
  updateJournal: (id: string, data: Partial<{ title: string; content: string; tags: string[] }>) =>
    http(`/journal/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteJournal: (id: string) => http(`/journal/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

export async function ensureDemoAuth() {
  console.log('🔐 Ensuring demo authentication...');
  
  // Check if we already have a token
  if (accessToken) {
    console.log('✅ Already authenticated with token');
    return;
  }
  
  try {
    console.log('🔄 Attempting to login demo user...');
    await api.login('demo@tijaniyah.com', 'demo123');
    console.log('✅ Demo user login successful');
  } catch (error: any) {
    console.log('❌ Demo login failed:', error.message);
    
    // If user already exists, try to login again
    if (error.message?.includes('User already exists') || error.message?.includes('Invalid credentials')) {
      console.log('🔄 User exists, trying signup then login...');
      try {
        await api.signup('demo@tijaniyah.com', 'demo123', 'Demo User');
        console.log('✅ Demo user signup successful');
        await api.login('demo@tijaniyah.com', 'demo123');
        console.log('✅ Demo user login after signup successful');
      } catch (signupError: any) {
        if (signupError.message?.includes('User already exists')) {
          console.log('🔄 User already exists, trying login again...');
          try {
            await api.login('demo@tijaniyah.com', 'demo123');
            console.log('✅ Demo user login successful after retry');
          } catch (retryError) {
            console.error('❌ Final login attempt failed:', retryError);
          }
        } else {
          console.error('❌ Demo signup failed:', signupError);
        }
      }
    } else {
      console.error('❌ Demo login failed with unexpected error:', error);
    }
  }
}
