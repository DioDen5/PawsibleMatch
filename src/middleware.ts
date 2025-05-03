
// Ensure this is at the very top
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// ONLY import the admin auth instance needed here
// Make sure the import path corresponds to the potentially modified export in firebase-admin.ts
import { auth as adminAuth } from '@/lib/firebase/firebase-admin';


// Function to verify the token using Firebase Admin SDK
async function verifyAuthToken(token: string) {
  // Ensure admin SDK has initialized (it should have already, but belt-and-suspenders)
  if (!adminAuth) {
     console.error("CRITICAL: Firebase Admin Auth is not initialized in middleware.");
     // Throw or return null, returning null allows graceful degradation if possible elsewhere
     return null;
  }
  try {
    // Verify the token using the imported adminAuth instance
    const decodedToken = await adminAuth.verifyIdToken(token, true); // Check for revocation
    return decodedToken;
  } catch (error: any) {
    console.error('Error verifying auth token in middleware:', error.code, error.message);
    // Handle specific errors like token expiration or revocation
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/id-token-revoked') {
      // Token is invalid, treat as unauthenticated
      return null;
    }
    // Log other errors but might still treat as unauthenticated
    return null;
  }
}


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('fb-auth-token'); // Adjust cookie name if needed
  const token = tokenCookie?.value;

  console.log(`Middleware executing for path: ${pathname}`); // Add logging

  // Define protected routes that require authentication and verification
  const protectedRoutes = [
    '/dashboard', // Matches /dashboard and /dashboard/*
    '/submit-found',
    // Add any other routes that need protection
  ];

  // Define routes that require login but not necessarily verification (like the verify page itself)
   const requiresAuthRoutes = ['/auth/verify-email'];

   // Define public routes or authentication routes (login, signup)
   const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password'];


  // --- Check 1: Accessing Auth Pages While Logged In ---
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
        const decodedToken = await verifyAuthToken(token);
        if (decodedToken) {
            // User is logged in and trying to access login/signup, redirect to dashboard
            // Extract role from custom claims (ensure claims are set!)
            const userRole = decodedToken.role as 'volunteer' | 'shelter' | undefined;
            const dashboardUrl = userRole === 'shelter' ? '/dashboard/shelter'
                               : userRole === 'volunteer' ? '/dashboard/volunteer'
                               : '/dashboard'; // Fallback if role claim is missing
             console.log(`Redirecting logged-in user ${decodedToken.uid} (role: ${userRole || 'N/A'}) from ${pathname} to ${dashboardUrl}`);
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }
         // If token exists but is invalid, let them proceed to login/signup, and clear the bad cookie.
         const response = NextResponse.next();
          console.log(`Invalid token found while accessing ${pathname}. Allowing access to auth page, clearing cookie.`);
         response.cookies.delete('fb-auth-token'); // Clear invalid token
         return response;
    }
    // Not logged in, allow access to public/auth routes
    console.log(`Allowing anonymous access to public route: ${pathname}`);
    return NextResponse.next();
  }

  // --- Check 2: Accessing Protected or Auth-Required Routes ---
  // Use startsWith for /dashboard to catch /dashboard/*
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRequiredRoute = requiresAuthRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute || isAuthRequiredRoute) {
    console.log(`Accessing protected or auth-required route: ${pathname}`);
    if (!token) {
      // No token found, redirect to login
       const loginUrl = new URL('/auth/login', request.url);
       loginUrl.searchParams.set('redirect', pathname); // Optional: redirect back after login
       console.log(`No token found for route ${pathname}. Redirecting to login.`);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the token
    const decodedToken = await verifyAuthToken(token);

    if (!decodedToken) {
      // Invalid or expired token, redirect to login
       const loginUrl = new URL('/auth/login', request.url);
       loginUrl.searchParams.set('redirect', pathname);
       console.log(`Invalid token for route ${pathname}. Redirecting to login and clearing cookie.`);
      // Clear the invalid cookie
       const response = NextResponse.redirect(loginUrl);
       response.cookies.delete('fb-auth-token'); // Clear invalid token
      return response;
    }

    console.log(`Token verified for user ${decodedToken.uid} accessing ${pathname}`);

    // --- Check 3: Email Verification ---
    // Only enforce verification for fully protected routes, not for the verify-email page itself
    if (isProtectedRoute && !decodedToken.email_verified) {
      console.log(`Email not verified for user ${decodedToken.uid} accessing protected route ${pathname}`);
      // Email not verified, redirect to verification page
       const verifyUrl = new URL('/auth/verify-email', request.url);
      // Prevent redirect loop if already on verify page
      if (pathname !== '/auth/verify-email') {
         console.log(`Redirecting user ${decodedToken.uid} to verify email page.`);
        return NextResponse.redirect(verifyUrl);
      }
      // Allow access if user is *on* the verify page itself and not verified
       console.log(`Allowing access to /auth/verify-email for unverified user ${decodedToken.uid}`);
       return NextResponse.next();
    }

     // Handle case where user is on verify page but token says they ARE verified (e.g., after clicking link)
    if (pathname === '/auth/verify-email' && decodedToken.email_verified) {
            const userRole = decodedToken.role as 'volunteer' | 'shelter' | undefined;
            const dashboardUrl = userRole === 'shelter' ? '/dashboard/shelter'
                               : userRole === 'volunteer' ? '/dashboard/volunteer'
                               : '/dashboard'; // Fallback
            console.log(`User ${decodedToken.uid} is now verified. Redirecting from verify page to ${dashboardUrl}.`);
            return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }


    // --- Check 4: Role-Based Redirect Logic within /dashboard ---
    if (pathname.startsWith('/dashboard')) {
        console.log(`Performing role check for user ${decodedToken.uid} accessing ${pathname}`);
        // Use role from custom claims (MUST be set during signup/role selection)
         const userRole = decodedToken.role as 'volunteer' | 'shelter' | undefined;
         console.log(`User role from token claim: ${userRole}`);

        // Redirect base /dashboard or /dashboard/ to role-specific path
        if (pathname === '/dashboard' || pathname === '/dashboard/') {
             if (userRole === 'volunteer') {
                 console.log(`Redirecting user ${decodedToken.uid} from /dashboard to /dashboard/volunteer`);
                 return NextResponse.redirect(new URL('/dashboard/volunteer', request.url));
             } else if (userRole === 'shelter') {
                 console.log(`Redirecting user ${decodedToken.uid} from /dashboard to /dashboard/shelter`);
                 return NextResponse.redirect(new URL('/dashboard/shelter', request.url));
             }
              // If role is still missing, could indicate incomplete signup or missing custom claim setup.
              // Redirecting to login might be safer than letting them access a potentially broken state.
              console.warn(`User ${decodedToken.uid} accessing /dashboard without a 'role' custom claim. Redirecting to login.`);
              const loginUrl = new URL('/auth/login', request.url);
              loginUrl.searchParams.set('error', 'missing_role'); // Optional: indicate issue
              const response = NextResponse.redirect(loginUrl);
              response.cookies.delete('fb-auth-token'); // Clear token as state is inconsistent
              return response;
        }

         // Prevent accessing wrong dashboard
         if (pathname.startsWith('/dashboard/shelter') && userRole !== 'shelter') {
            console.log(`Unauthorized access attempt by ${decodedToken.uid} (role: ${userRole}) to /dashboard/shelter. Redirecting.`);
            const correctDashboard = userRole === 'volunteer' ? '/dashboard/volunteer' : '/dashboard'; // Fallback
            return NextResponse.redirect(new URL(correctDashboard, request.url));
         }
         if (pathname.startsWith('/dashboard/volunteer') && userRole !== 'volunteer') {
             console.log(`Unauthorized access attempt by ${decodedToken.uid} (role: ${userRole}) to /dashboard/volunteer. Redirecting.`);
             const correctDashboard = userRole === 'shelter' ? '/dashboard/shelter' : '/dashboard'; // Fallback
            return NextResponse.redirect(new URL(correctDashboard, request.url));
         }
    }


    // User is authenticated, verified (if required), and has correct role (if checked), allow access
     console.log(`Access granted for user ${decodedToken.uid} to ${pathname}.`);
    return NextResponse.next();
  }

  // --- Check 5: Default Case (Publicly Accessible Routes) ---
  // Allow access to non-protected, non-auth routes without checks (e.g., /, /about)
  console.log(`Allowing access to public route: ${pathname}`);
  return NextResponse.next();
}

// Configure the middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - healthz (health check endpoint)
     */
     // Apply middleware to all routes except static assets and API routes.
     '/((?!api|_next/static|_next/image|favicon.ico|healthz).*)',
  ],
};
