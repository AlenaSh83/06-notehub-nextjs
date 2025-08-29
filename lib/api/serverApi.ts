import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';
const externalBaseURL = 'https://notehub-api.goit.study';

async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok && response.status !== 401) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

async function externalServerFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${externalBaseURL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export const serverAuthService = {
  async getProfile(): Promise<User> {
    return serverFetch('/users/me');
  },

  async getSession(): Promise<User | null> {
    try {
      const data = await serverFetch('/auth/session');
      return data.user || null;
    } catch {
      return null;
    }
  },
};

export const serverNotesService = {
  async fetchNotes(params?: {
    page?: number;
    perPage?: number;
    search?: string;
    tag?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const query = queryParams.toString();
    return externalServerFetch(`/notes${query ? `?${query}` : ''}`);
  },

  async fetchNoteById(id: string): Promise<Note> {
    return externalServerFetch(`/notes/${id}`);
  },
};
