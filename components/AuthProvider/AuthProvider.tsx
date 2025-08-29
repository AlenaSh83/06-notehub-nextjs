'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const protectedPaths = ['/notes', '/profile'];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await authService.getSession();
        setUser(userData);

        if (!userData && isProtectedPath) {
          router.push('/sign-in');
        }
      } catch {
        console.log('Session check - user not authenticated');
        setUser(null);
        if (isProtectedPath) {
          router.push('/sign-in');
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [setUser, isProtectedPath, router]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
      clearIsAuthenticated();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user && isProtectedPath) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
