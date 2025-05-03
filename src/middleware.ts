import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/firebase-admin'; // Import admin SDK initialized auth

// Function to verify the token using Firebase Admin SDK
async function verifyAuthToken(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication and verification
  const protectedRoutes = [
    '/dashboard',
    '/submit-found',
    // Add any other routes that need protection
  ];

  // Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('fb-auth-token')?.value; // Adjust cookie name if needed

    if (!token) {
      // No token found, redirect to login
       const loginUrl = new URL('/auth/login', request.url);
       loginUrl.searchParams.set('redirect', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }

    // Verify the token
    const decodedToken = await verifyAuthToken(token);

    if (!decodedToken) {
      // Invalid or expired token, redirect to login
       const loginUrl = new URL('/auth/login', request.url);
       loginUrl.searchParams.set('redirect', pathname);
      // Optional: Clear the invalid cookie
       const response = NextResponse.redirect(loginUrl);
       response.cookies.delete('fb-auth-token');
      return response;
    }

    // Check if email is verified
    if (!decodedToken.email_verified) {
      // Email not verified, redirect to verification page
       const verifyUrl = new URL('/auth/verify-email', request.url);
      // Prevent redirect loop if already on verify page (though verify page should handle authenticated+verified case)
      if (pathname !== '/auth/verify-email') {
        return NextResponse.redirect(verifyUrl);
      }
    }

    // --- Role-Based Redirect Logic within /dashboard ---
    if (pathname.startsWith('/dashboard')) {
        const userRole = decodedToken.role as 'volunteer' | 'shelter' | undefined; // Assuming role is stored in custom claims

        // If trying to access the generic /dashboard, redirect based on role
        if (pathname === '/dashboard' || pathname === '/dashboard/') {
             if (userRole === 'volunteer') {
                 return NextResponse.redirect(new URL('/dashboard/volunteer', request.url));
             } else if (userRole === 'shelter') {
                 return NextResponse.redirect(new URL('/dashboard/shelter', request.url));
             }
             // If role is missing or unexpected, maybe redirect to a profile setup or default dashboard
             // For now, allow access to /dashboard if role claim isn't set, or handle as needed
        }
        // You could add more specific checks here, e.g.,
        // else if (pathname.startsWith('/dashboard/shelter') && userRole !== 'shelter') {
        //     return NextResponse.redirect(new URL('/unauthorized', request.url)); // Or back to their correct dashboard
        // }
        // else if (pathname.startsWith('/dashboard/volunteer') && userRole !== 'volunteer') {
        //     return NextResponse.redirect(new URL('/unauthorized', request.url));
        // }
    }


    // User is authenticated and verified (and role check passed for /dashboard), allow access
    return NextResponse.next();
  }

  // Allow access to non-protected routes
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
     * - auth (authentication routes themselves, except verify-email which might need check)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/signup|auth/forgot-password).*)',
     // Explicitly include verify-email route to be checked by middleware logic if needed
     // but the main logic inside handles the redirect prevention.
     // '/auth/verify-email',
  ],
};
