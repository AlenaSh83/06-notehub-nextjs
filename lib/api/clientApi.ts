import { apiClient } from './api';
import type { User, AuthCredentials } from '@/types/user';
import type { Note, CreateNoteParams } from '@/types/note';

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

interface NotesApiResponse {
  notes: Note[];
  totalPages: number;
}

export const authService = {
  async register(credentials: AuthCredentials) {
    const { data } = await apiClient.post('/auth/register', credentials);
    return data;
  },

  async login(credentials: AuthCredentials) {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
  },

  async getSession() {
    try {
      const { data } = await apiClient.get('/auth/session');
      return data.user || null;
    } catch {
      return null;
    }
  },
  
  async updateProfile(userData: Partial<User>) {
    const { data } = await apiClient.patch('/users/me', userData);
    return data;
  },
};


export const notesService = {
  async fetchNotes(params: FetchNotesParams = {}): Promise<NotesApiResponse> {
    const { page = 1, perPage = 12, search = '', tag } = params;
    const queryParams = new URLSearchParams();

    queryParams.append('page', page.toString());
    queryParams.append('perPage', perPage.toString());

    if (search) {
      queryParams.append('search', search);
    }

    if (tag) {
      queryParams.append('tag', tag);
    }

    const response = await apiClient.get<NotesApiResponse>(
      `/notes?${queryParams.toString()}`
    );
    return response.data;
  },

  async fetchNoteById(id: string): Promise<Note> {
    const response = await apiClient.get<Note>(`/notes/${id}`);
    return response.data;
  },

  async createNote(note: CreateNoteParams): Promise<Note> {
    const response = await apiClient.post<Note>('/notes', note);
    return response.data;
  },

  async deleteNote(id: string): Promise<Note> {
    const response = await apiClient.delete<Note>(`/notes/${id}`);
    return response.data;
  },
};


export const { fetchNotes, fetchNoteById, createNote, deleteNote } = notesService;
