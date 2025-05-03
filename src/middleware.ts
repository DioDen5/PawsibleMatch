
// src/middleware.ts

// IMPORTANT: This line ensures the middleware runs on the Node.js runtime,
// allowing the use of Node.js modules like 'firebase-admin'.
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// ONLY import the admin auth instance needed here
// Ensure the import path matches the export from firebase-admin.ts
import { auth as adminAuth } from '@/lib/firebase/firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';


// Function to verify the token using Firebase Admin SDK
async function verifyAuthToken(token: string): Promise<DecodedIdToken | null> {
  // Ensure admin SDK has initialized (it should have already, but double-check)
  if (!adminAuth) {
     console.error("CRITICAL: Firebase Admin Auth is not initialized in middleware.");
     // Return null to treat as unauthenticated
     return null;
  }
  try {
    // Verify the token using the imported adminAuth instance
    const decodedToken = await adminAuth.verifyIdToken(token, true); // Check for revocation
    return decodedToken;
  } catch (error: any) {
    console.error('Middleware: Error verifying auth token:', error.code, error.message);
    // Handle specific errors like token expiration or revocation
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/id-token-revoked') {
      // Token is invalid, treat as unauthenticated
      return null;
    }
    // Log other errors but still treat as unauthenticated
    return null;
  }
}


// --- Middleware Logic ---
// This function MUST be exported
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('fb-auth-token'); // Adjust cookie name if it differs
  const token = tokenCookie?.value;

  // Log entry point for debugging
  console.log(`[Middleware] Path: ${pathname}, Token present: ${!!token}`);

  // Define route categories
  const protectedRoutes = [
    '/dashboard', // Matches /dashboard and /dashboard/*
    '/submit-found',
    // Add any other routes that need login + verification
  ];
  const requiresAuthRoutes = ['/auth/verify-email']; // Needs login, but not necessarily verification
  const publicAuthRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password']; // Login/signup pages


  // --- 1. Handle Public Auth Routes ---
  if (publicAuthRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
        const decodedToken = await verifyAuthToken(token);
        if (decodedToken) {
            // User is logged in, redirect from auth pages
            // Check custom claims for role if available
            const userRole = decodedToken.role as 'volunteer' | 'shelter' | undefined;
            const isVerified = decodedToken.email_verified;

            if (!isVerified) {
                 console.log(`[Middleware] Logged-in user ${decodedToken.uid} is not verified. Redirecting to /auth/verify-email from ${pathname}`);
                 return NextResponse.redirect(new URL('/auth/verify-email', request.url));
            }

            const dashboardUrl = userRole === 'shelter' ? '/dashboard/shelter'
                               : userRole === 'volunteer' ? '/dashboard/volunteer'
                               : '/dashboard'; // Default fallback
             console.log(`[Middleware] Redirecting logged-in verified user ${decodedToken.uid} (role: ${userRole || 'N/A'}) from ${pathname} to ${dashboardUrl}`);
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }
         // Invalid token on auth page? Clear it and let them access.
         const response = NextResponse.next();
          console.log(`[Middleware] Invalid token on auth page ${pathname}. Clearing cookie.`);
         response.cookies.delete('fb-auth-token');
         return response;
    }
    // No token, allow access to public auth routes
    console.log(`[Middleware] Allowing anonymous access to public auth route: ${pathname}`);
    return NextResponse.next();
  }

  // --- 2. Handle Protected & Auth-Required Routes ---
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRequiredRoute = requiresAuthRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute || isAuthRequiredRoute) {
    console.log(`[Middleware] Accessing protected/auth-required route: ${pathname}`);
    if (!token) {
       const loginUrl = new URL('/auth/login', request.url);
       loginUrl.searchParams.set('redirect', pathname);
       console.log(`[Middleware] No token for ${pathname}. Redirecting to login.`);
      return NextResponse.redirect(loginUrl);
    }

    const decodedToken = await verifyAuthToken(token);

    if (!decodedToken) {
       const loginUrl = new URL('/auth/login', request.url);
       loginUrl.searchParams.set('redirect', pathname);
       console.log(`[Middleware] Invalid token for ${pathname}. Redirecting to login and clearing cookie.`);
       const response = NextResponse.redirect(loginUrl);
       response.cookies.delete('fb-auth-token');
      return response;
    }

    console.log(`[Middleware] Token verified for user ${decodedToken.uid}`);

    // --- 3. Check Email Verification ---
    const isVerified = decodedToken.email_verified;

    if (isProtectedRoute && !isVerified) {
      // Allow access to /auth/verify-email itself even if unverified
      if (pathname === '/auth/verify-email') {
        console.log(`[Middleware] Allowing unverified user ${decodedToken.uid} access to /auth/verify-email.`);
        return NextResponse.next();
      }
      // Otherwise, redirect to verify page
      const verifyUrl = new URL('/auth/verify-email', request.url);
      console.log(`[Middleware] User ${decodedToken.uid} not verified for protected route ${pathname}. Redirecting to verify email.`);
      return NextResponse.redirect(verifyUrl);
    }

    if (pathname === '/auth/verify-email' && isVerified) {
      // Verified user trying to access verify page, redirect to dashboard
       const userRole = decodedToken.role as 'volunteer' | 'shelter' | undefined;
       const dashboardUrl = userRole === 'shelter' ? '/dashboard/shelter'
                           : userRole === 'volunteer' ? '/dashboard/volunteer'
                           : '/dashboard'; // Default fallback
      console.log(`[Middleware] Verified user ${decodedToken.uid} on verify page. Redirecting to ${dashboardUrl}.`);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // --- 4. Role-Based Redirect for /dashboard ---
    if (pathname.startsWith('/dashboard')) {
       if (!isVerified) {
          console.warn(`[Middleware] Safeguard: Unverified user ${decodedToken.uid} reached dashboard check for ${pathname}. Redirecting to verify.`);
          return NextResponse.redirect(new URL('/auth/verify-email', request.url));
       }

      // Use custom claim 'role' if present in the token
      const userRole = decodedToken.role as 'volunteer' | 'shelter' | undefined;
      console.log(`[Middleware] Role check for verified user ${decodedToken.uid} (role from token: ${userRole || 'N/A'}) accessing ${pathname}`);

      if (pathname === '/dashboard' || pathname === '/dashboard/') {
        if (userRole === 'volunteer') {
          console.log(`[Middleware] Redirecting user ${decodedToken.uid} from /dashboard to /dashboard/volunteer`);
          return NextResponse.redirect(new URL('/dashboard/volunteer', request.url));
        } else if (userRole === 'shelter') {
          console.log(`[Middleware] Redirecting user ${decodedToken.uid} from /dashboard to /dashboard/shelter`);
          return NextResponse.redirect(new URL('/dashboard/shelter', request.url));
        } else {
          // Role missing in token - this indicates a potential issue during signup/profile creation
          // Or the custom claim wasn't set correctly.
          console.error(`[Middleware] CRITICAL: User ${decodedToken.uid} lacks 'role' custom claim in token. Redirecting to login.`);
          const loginUrl = new URL('/auth/login', request.url);
          loginUrl.searchParams.set('error', 'missing_role_claim');
          const response = NextResponse.redirect(loginUrl);
          // Log out the user by clearing the cookie if role is missing
          response.cookies.delete('fb-auth-token');
          return response;
        }
      }

      // Prevent accessing the wrong dashboard type
      if (pathname.startsWith('/dashboard/shelter') && userRole !== 'shelter') {
        console.log(`[Middleware] Unauthorized access attempt by ${decodedToken.uid} (role: ${userRole}) to /dashboard/shelter. Redirecting.`);
        const correctDashboard = userRole === 'volunteer' ? '/dashboard/volunteer' : '/dashboard'; // Redirect to volunteer or base
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
      if (pathname.startsWith('/dashboard/volunteer') && userRole !== 'volunteer') {
        console.log(`[Middleware] Unauthorized access attempt by ${decodedToken.uid} (role: ${userRole}) to /dashboard/volunteer. Redirecting.`);
        const correctDashboard = userRole === 'shelter' ? '/dashboard/shelter' : '/dashboard'; // Redirect to shelter or base
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
    }

    // --- 5. Access Granted ---
    console.log(`[Middleware] Access granted for user ${decodedToken.uid} (Verified: ${isVerified}) to ${pathname}.`);
    return NextResponse.next();
  }

  // --- Default: Allow access to all other public routes ---
  console.log(`[Middleware] Allowing public access to route: ${pathname}`);
  return NextResponse.next();
}

// --- Middleware Configuration ---
// This configures which paths the middleware function will run on.
// This MUST be exported
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
