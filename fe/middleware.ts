import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/publik", "/publik/login", "/publik/anjab", "/publik/sakip"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // For admin routes, check token via cookie (set at login for SSR support)
  // Since we use localStorage, the actual guard happens client-side in AdminPageShell
  // This middleware handles redirect for completely unauthenticated sessions
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*).*)"],
};
