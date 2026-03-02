import { NextRequest, NextResponse } from 'next/server';

import { getBaseUrl } from '#utils/url';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';

  if (host.startsWith('www.')) {
    const redirectUrl = `${getBaseUrl()}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|api|favicon.ico).*)',
};
