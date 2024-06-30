// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the request if it's a public route or the user is authenticated
  if (pathname === '/' || token) {
    return NextResponse.next();
  }

  // Redirect to the main page if the user is not authenticated
  return NextResponse.redirect(new URL('/login', req.url));
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    '/dashboard/:path*', // All routes under /dashboard
    '/bookings/:path*', // All routes under /bookings
    '/menus/:path*', // All routes under /menus
    '/rooms/:path*', // All routes under /rooms
    '/sites/:path*' // All routes under /sites
  ]
};
