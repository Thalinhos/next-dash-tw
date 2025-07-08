import { NextRequest, NextResponse } from 'next/server';
import { validarToken } from './utils/jwt';


export async function middleware(request: NextRequest) {

  console.log('middleware goin trhu')

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const isValid = await validarToken(token);

    if (!isValid) {
          return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (e) {
        return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
