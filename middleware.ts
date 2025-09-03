import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { serverAuthService } from './lib/api/serverApi';

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
  
  if (!accessToken && !refreshToken) {
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }
  
  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await serverAuthService.getSession();
      
      const response = sessionResponse as { status?: number; headers?: Record<string, string | string[]> };
      
      if (response.status === 200) {
       
        const nextResponse = NextResponse.next();
        
       
        if (response.headers) {
          const setCookieHeader = response.headers['set-cookie'];
          if (setCookieHeader) {
            if (Array.isArray(setCookieHeader)) {
              setCookieHeader.forEach((cookie: string) => {
                nextResponse.headers.append('set-cookie', cookie);
              });
            } else if (typeof setCookieHeader === 'string') {
              nextResponse.headers.append('set-cookie', setCookieHeader);
            }
          }
        }
        
        if (isAuthPath) {
          return NextResponse.redirect(new URL('/profile', request.url));
        }
        
        return nextResponse;
      }
      
      if (isProtectedPath) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    } catch  {
    
      if (isProtectedPath) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
    
    return NextResponse.next();
  }
  
 
  if (accessToken) {
    
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
    
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};