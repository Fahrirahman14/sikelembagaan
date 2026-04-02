import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(_request: NextRequest) {
  // Auth is guarded client-side via AdminPageShell (tokens in localStorage).
  // Public routes: / /login /anjab /sakip
  // Protected routes: /admin/**
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*).*)"],
};
