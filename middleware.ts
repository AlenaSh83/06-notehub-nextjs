import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  const protectedPaths = ['/notes', '/profile'];
  const authPaths = ['/sign-in', '/sign-up'];
  
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  
  
  if (!accessToken && !refreshToken && isProtectedPath) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  
  if (!accessToken && refreshToken && isProtectedPath) {
    try {
      const refreshResponse = await fetch(new URL('/api/auth/refresh', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refreshToken=${refreshToken}`,
        },
      });
      
      if (refreshResponse.ok) {
        const response = NextResponse.next();
        
        
        const setCookieHeader = refreshResponse.headers.get('set-cookie');
        if (setCookieHeader) {
          response.headers.set('set-cookie', setCookieHeader);
        }
        
        return response;
      } else {
        
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  
  
  if (accessToken && isAuthPath) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
