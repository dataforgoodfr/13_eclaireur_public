import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';

  if (host.startsWith('www.')) {
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eclaireurpublic.fr').replace(
      /\/$/,
      '',
    );
    const redirectUrl = `${baseUrl}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|api|favicon.ico).*)',
};
