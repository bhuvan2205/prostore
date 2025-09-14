import { NextRequest, NextResponse } from "next/server";
import { SESSION_CART_ID } from "@/constants/cart";
import { PROTECTED_ROUTES } from "@/constants/user";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => route.test(pathname));
  
  // For protected routes, redirect to sign-in if no session token
  if (isProtectedRoute) {
    const sessionToken = request.cookies.get("authjs.session-token") || 
                        request.cookies.get("__Secure-authjs.session-token");
    
    if (!sessionToken) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Handle session cart ID for all routes
  if (!request.cookies.get(SESSION_CART_ID)) {
    // Generate new session cart id cookie
    const sessionCartId = crypto.randomUUID();

    // Clone the req headers
    const newRequestHeaders = new Headers(request.headers);

    // Create new response and add the new headers
    const response = NextResponse.next({
      request: {
        headers: newRequestHeaders,
      },
    });

    // Set newly generated sessionCartId in the response cookies
    response.cookies.set(SESSION_CART_ID, sessionCartId);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
