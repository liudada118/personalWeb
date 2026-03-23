"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { withBasePath } from "@/lib/site-paths";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const key = `analytics:${pathname}`;

    if (window.sessionStorage.getItem(key)) {
      return;
    }

    window.sessionStorage.setItem(key, "1");

    fetch(withBasePath("/api/analytics"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
