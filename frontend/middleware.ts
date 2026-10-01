import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import path from 'path'

const protectedRoutes = ['/dashboard', '/profile']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check the local first-party cookie string
  const hasToken = request.cookies.has('auth_token')

  // 1. Unauthenticated users kicked out of dashboard
  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/' && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Authenticated users redirected away from login/signup pages
  if ((pathname === '/login' || pathname === '/signup' || pathname === '/') && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/profile/:path*'],
}