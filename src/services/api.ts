import Constants from 'expo-constants';

export const API_URL: string =
  ((Constants.expoConfig?.extra as any)?.API_URL as string) ||
  'https://tijaniyahmuslimproappreact-production-1e25.up.railway.app';

let accessToken: string | null = null;
export const setToken = (token: string | null) => {
  accessToken = token;
};

async function http(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
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
  try {
    await api.login('demo@tijaniyah.com', 'demo123');
  } catch {
    try {
      await api.signup('demo@tijaniyah.com', 'demo123', 'Demo User');
      await api.login('demo@tijaniyah.com', 'demo123');
    } catch {}
  }
}
