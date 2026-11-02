const API = process.env.NEXT_PUBLIC_API_URL!;

function xsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken(),
      ...options.headers,
    },
  });

  if (!res.ok) throw await res.json().catch(() => ({ message: res.statusText }));
  return res.status === 204 ? (undefined as T) : res.json();
}

export async function login(email: string, password: string) {
  // Sets the XSRF-TOKEN cookie; must be called before login
  await fetch(`${API}/sanctum/csrf-cookie`, { credentials: 'include' });
  return api('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export const logout = () => api('/logout', { method: 'POST' });
export const getMe = () => api('/me');
export const getTransactions = (page = 1) => api(`/transactions?page=${page}`);
