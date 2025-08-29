import axios from 'axios';
import type { User, AuthCredentials, AuthResponse } from '@/types/user';

const authApi = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    const { data } = await authApi.post<AuthResponse>(
      '/auth/register',
      credentials
    );
    return data;
  },

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const { data } = await authApi.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return data;
  },

  async logout(): Promise<void> {
    await authApi.post('/auth/logout');
  },

  async getSession(): Promise<User | null> {
    try {
      const { data } = await authApi.get<User>('/auth/session');
      return data;
    } catch {
      return null;
    }
  },

  async getProfile(): Promise<User> {
    const { data } = await authApi.get<User>('/users/me');
    return data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const { data } = await authApi.patch<User>('/users/me', userData);
    return data;
  },
};
