import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/', '/laporan', '/input-data', '/account'];
const authPaths = ['/signin', '/register'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  const isLoggedIn = !!token && token !== 'undefined' && token !== 'null';

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // Cegah redirect loop: jika sudah di /signin dan redirect param-nya juga /signin, jangan redirect lagi
  const redirectParam = request.nextUrl.searchParams.get('redirect');
  const isRedirectLoop = pathname === '/signin' && redirectParam === '/signin';

  if (isProtectedPath && !isLoggedIn && !isRedirectLoop) {
    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && isLoggedIn) {
    const dashboardUrl = new URL('/account', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
