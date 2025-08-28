import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const tokenCookie = request.cookies.get('accessToken');
    const { pathname } = request.nextUrl;
    const isAuthPage = pathname === '/auth/login' || pathname === '/auth/signup';

    if (!tokenCookie) {
        if (isAuthPage) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const decodedPayload = parseJwt(tokenCookie.value);

    if (!decodedPayload || !decodedPayload.role) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('accessToken');
        return response;
    }

    const userRole = decodedPayload.role;

    if (isAuthPage) {
        if (userRole === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        if (userRole === 'tourist') return NextResponse.redirect(new URL('/tourist/home', request.url));
        if (userRole === 'tour_guide') return NextResponse.redirect(new URL('/tour-guide/account', request.url));
    }

    if (pathname.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (pathname.startsWith('/tour-guide') && userRole !== 'tour_guide') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (pathname.startsWith('/tourist') && userRole !== 'tourist') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/tour-guide/:path*',
        '/tourist/:path*',
        '/login',
        '/signup',
    ],
};