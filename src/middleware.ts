// middleware.ts
import { parse } from "cookie";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookies = request.headers.get("cookie") || "";
    const parsedCookies = parse(cookies);

    const token = parsedCookies.token;

    if (!token && process.env.NODE_ENV !== "development") {
      const url = request.nextUrl.clone();
      url.pathname = "/not-found";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
