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
  
  
  if (!accessToken && !refreshToken) {
  
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
   
    return NextResponse.next();
  }
  
  
  if (!accessToken && refreshToken) {
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
   
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
  }
  
  if (accessToken) {
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};