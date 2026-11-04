// Next.js 16 name for middleware.ts. Runs auth()'s `authorized` callback on each matched request.
export { auth as proxy } from '@/auth';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
