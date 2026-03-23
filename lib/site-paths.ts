const ABSOLUTE_URL = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export function normalizeBasePath(value?: string) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed === "/") {
    return "";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

export const siteBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export function withBasePath(pathname: string) {
  if (!pathname) {
    return siteBasePath || "/";
  }

  if (ABSOLUTE_URL.test(pathname) || pathname.startsWith("//") || pathname.startsWith("#")) {
    return pathname;
  }

  if (!pathname.startsWith("/")) {
    return pathname;
  }

  if (!siteBasePath) {
    return pathname;
  }

  if (pathname === "/") {
    return `${siteBasePath}/`;
  }

  return pathname.startsWith(siteBasePath) ? pathname : `${siteBasePath}${pathname}`;
}

