// proxy.ts (Edge safe)
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("primus_token")?.value;
  const pathname = req.nextUrl.pathname;

  // public routes
if (
  pathname.startsWith("/login") ||
  pathname.startsWith("/signup") ||
  pathname.startsWith("/academic-session") ||
  pathname.startsWith("/settings-setup")
) {
  return NextResponse.next();
}


  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
