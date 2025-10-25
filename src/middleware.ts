import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // const role = req.cookies.get("role")?.value;
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    const destination = `/select-role?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // const roleMap = {
  //   Leader: "/leader",
  //   Warden: "/warden",
  //   Admin: "/admin",
  // };

  // for (const [r, basePath] of Object.entries(roleMap)) {
  //   if (pathname.startsWith(basePath) && role !== r) {
  //     const redirectTo = "/";
  //     return NextResponse.redirect(new URL(redirectTo, req.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/book-categories",
    "/admin/book-categories/new-book-category",
    "/admin/books",
    "/admin/books/add-new-book",
    "/admin/books/book-overview",
    "/settings",
  ],
};
