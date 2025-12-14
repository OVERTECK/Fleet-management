import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    console.log('Middleware - Path:', pathname, 'Has token:', !!token);

    if (!token && !pathname.startsWith('/auth') && pathname !== '/') {
        console.log('Redirecting to auth - no token');
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    if (token && pathname.startsWith('/auth')) {
        console.log('Redirecting to dashboard - has token');
        return NextResponse.redirect(new URL('/dashboard', request.url));
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};