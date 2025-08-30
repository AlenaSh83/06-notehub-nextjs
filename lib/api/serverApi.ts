import { cookies } from 'next/headers';
import axios from 'axios';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';


const serverApiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


serverApiClient.interceptors.request.use((config) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  
  if (cookieHeader) {
    config.headers.Cookie = cookieHeader;
  }
  
  return config;
});

export const serverAuthService = {
  async getProfile(): Promise<User> {
    const { data } = await serverApiClient.get<User>('/users/me');
    return data;
  },

  async getSession() {
    try {
      const response = await serverApiClient.get('/auth/session');
      return response; 
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
    const { data } = await serverApiClient.get(`/notes${query ? `?${query}` : ''}`);
    return data;
  },

  async fetchNoteById(id: string): Promise<Note> {
    const { data } = await serverApiClient.get<Note>(`/notes/${id}`);
    return data; 
  },
};
