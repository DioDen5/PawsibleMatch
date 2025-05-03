
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic middleware function - can be expanded later
export function middleware(request: NextRequest) {
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);
  // Add authentication/authorization logic here
  return NextResponse.next(); // Continue to the requested page/route
}

// Configuration for the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - healthz (health check endpoint - good practice to exclude)
     * Filter out specific file extensions like .png, .jpg, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|healthz|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// IMPORTANT: To use Firebase Admin SDK (which requires Node.js APIs),
// you MUST explicitly set the runtime to 'nodejs'.
// Remove or comment out the line below if you switch to edge-compatible logic only.
export const runtime = 'nodejs';
