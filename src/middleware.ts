import { NextResponse, NextRequest } from "next/server";
import { auth } from "./auth";
export { auth } from "./auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await auth();
  console.log(token);
  const url = request.nextUrl;

  if (!token?.user && (
      url.pathname === "/" ||
      url.pathname.startsWith("/chat") ||
      url.pathname.startsWith("/upload")
  )) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    token?.user?.role === "clerk" &&
    (
      url.pathname === "/" ||
      url.pathname === "/login" ||
      url.pathname === "/signup" ||
      url.pathname === "/verify"
    )
  ) {
    return NextResponse.redirect(new URL("/upload", request.url));
  }

  if (
    token?.user?.role === "judge" &&
    (
      url.pathname === "/login" ||
      url.pathname === "/signup" ||
      url.pathname === "/verify"
    )
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/login", "/signup", "/", "/verify", "/chat/:path*","/upload"],
};
