import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value
  const userRole = request.cookies.get('user_role')?.value
  const pathname = request.nextUrl.pathname

  // 1. Proteksi Halaman HR
  if (pathname.startsWith('/hr')) {
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (userRole !== 'hr') {
      return NextResponse.redirect(new URL('/candidate/builder', request.url))
    }
  }

  // 2. Proteksi Halaman Candidate
  if (pathname.startsWith('/candidate')) {
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (userRole !== 'candidate') {
      return NextResponse.redirect(new URL('/hr/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/hr/:path*', '/candidate/:path*'],
}