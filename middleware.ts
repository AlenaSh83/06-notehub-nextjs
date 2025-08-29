import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/notes', '/profile'];

  const authPaths = ['/sign-in', '/sign-up'];

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  try {
    const response = await fetch(new URL('/api/auth/session', request.url), {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();
    const isAuthenticated = !!data?.user;

    if (isAuthenticated && isAuthPath) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    if (!isAuthenticated && isProtectedPath) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
