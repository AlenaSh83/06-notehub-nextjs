import { cookies } from 'next/headers';
import { apiClient } from './api';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';

export const serverAuthService = {
  async getProfile(): Promise<User> {
    const cookieStore = await cookies();
    const { data } = await apiClient.get<User>('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  },

  async getSession() {
    const cookieStore = await cookies();
    try {
      const response = await apiClient.get('/auth/session', {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });
      return response;
    } catch (error) {
      return error;
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
    const cookieStore = await cookies();
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const query = queryParams.toString();
    const { data } = await apiClient.get(`/notes${query ? `?${query}` : ''}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  },

  async fetchNoteById(id: string): Promise<Note> {
    const cookieStore = await cookies();
    const { data } = await apiClient.get<Note>(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  },
};
