import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });
  const session = await res.json();

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
