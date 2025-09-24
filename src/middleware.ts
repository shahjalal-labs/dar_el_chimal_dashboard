import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  // const role = req.cookies.get("role")?.value;
  // const category = req.cookies.get("category")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    const destination = `/login?redirect=${encodeURIComponent(pathname)}`;
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
    "/admin/ecommerce-category",
    "/admin/manage-customers",
    "/admin/manage-finances",
    "/admin/manage-order",
    "/admin/manage-revenue",
    "/admin/manage-transactions",
    "/admin/manage-vendor",
    "/admin/payment-management",
    "/admin/sports-category",
    "/vendor/ecommerce/manage-cashiers",
    "/vendor/ecommerce/manage-on-store",
    "/vendor/ecommerce/manage-product",
    "/vendor/ecommerce/order-management",
    "/vendor/event/manage-booking",
    "/vendor/event/manage-event",
    "/vendor/playground/ground-availability",
    "/vendor/playground/ground-details",
    "/vendor/playground/playground-booking",
    "/bank-info",
    "/settings",
  ],
};
