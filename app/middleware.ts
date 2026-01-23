import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AcademicSession from "@/app/models/AcademicSession";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("primus_token")?.value;
  const pathname = req.nextUrl.pathname;

  // public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await connectDB();
    const admin = await verifyAuth();

    const activeSession = await AcademicSession.findOne({
      schoolId: admin.schoolId,
      isActive: true,
    });

    // No session → force setup
    if (!activeSession && pathname !== "/academic-session") {
      return NextResponse.redirect(
        new URL("/academic-session", req.url)
      );
    }

    // Session exists → block session page
    if (activeSession && pathname === "/academic-session") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
