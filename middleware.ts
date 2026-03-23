import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { PREVIEW_HEADER_NAME, PREVIEW_QUERY_PARAM } from "@/lib/payload/preview-constants";

export function middleware(request: NextRequest) {
  const previewToken = request.nextUrl.searchParams.get(PREVIEW_QUERY_PARAM);

  if (!previewToken) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PREVIEW_HEADER_NAME, previewToken);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
