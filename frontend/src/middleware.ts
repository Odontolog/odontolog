import { NextResponse, type NextRequest } from 'next/server';

import { auth } from '@/shared/auth';
import {
  AUTH_ROUTES,
  DEFAULT_REDIRECT,
  SUPERVISOR_ROUTES,
  NOT_FOUND,
} from '@/shared/routes';

export async function middleware(request: NextRequest) {
  const session = await auth();

  const isAuthenticated = !!session;
  const isAuthRoute = AUTH_ROUTES.includes(request.nextUrl.pathname);

  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }

  const isSupervisorRoute = SUPERVISOR_ROUTES.includes(
    request.nextUrl.pathname,
  );

  const loggedUserRole = session?.user.role;
  const isStudent = loggedUserRole === 'STUDENT';

  if (isAuthenticated && isSupervisorRoute && isStudent) {
    return NextResponse.redirect(new URL(NOT_FOUND, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|images|icons|fonts|api).*)',
  ],
};
