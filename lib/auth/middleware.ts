import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './service';

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const session = verifyToken(token);
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return null; // Allow request to proceed
}
