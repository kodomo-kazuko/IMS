import { NextRequest, NextResponse } from 'next/server';
import jwtDecode from 'jwt-decode';

export async function middleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Decode the token without verification
    
    
  } catch (err) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Define the routes that the middleware should be applied to
export const config = {
  matcher: ['/api/protected/:path*', '/protected/:path*'],
};
