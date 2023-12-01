// This middleware only exists to the the url in server components
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const requestHeaders = new Headers(request.headers);
  const url = new URL(request.url);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("x-origin", url.origin);
  requestHeaders.set("x-pathname", url.pathname);

  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}
