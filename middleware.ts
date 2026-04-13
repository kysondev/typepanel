import { AUTH_ROUTES, PROTECTED_ROUTES } from "@common/config/routes";
import { NextResponse, type NextRequest } from "next/server";

async function getSession(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const url = new URL("/api/auth/get-session", baseUrl);
    const req = await fetch(url, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    if (!req.ok) return null;

    const text = await req.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse session response:", err);
      return null;
    }
  } catch (err) {
    console.error("Session fetch error:", err);
    return null;
  }
}

async function hasAdminUser(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const url = new URL("/api/admin/check-exist", baseUrl);
    const req = await fetch(url);
    const res = await req.json();
    return res.adminExist;
  } catch (err) {
    console.error("Admin fetch error:", err);
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => currentPath === route || currentPath.startsWith(`${route}/`),
  );
  const isAuthRoute = AUTH_ROUTES.includes(currentPath);
  const isAdminRoute =
    currentPath === "/admin" || currentPath.startsWith("/admin/");

  if (isProtectedRoute || isAuthRoute || isAdminRoute) {
    const session = await getSession(request);

    if (session) {
      if (isAdminRoute && session.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (AUTH_ROUTES.includes(currentPath)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      const adminExists = await hasAdminUser(request);
      if (!adminExists && currentPath !== "/auth/admin-setup") {
        return NextResponse.redirect(new URL("/auth/admin-setup", request.url));
      }
      if (adminExists && currentPath === "/auth/admin-setup") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
      if (!isAuthRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|403|404|500|images).*)",
  ],
};
