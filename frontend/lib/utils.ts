import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Auth.js passes the original URL as ?callbackUrl=... (often absolute).
// Only the path + query is ever used, so a crafted link can never send the user off-site.
export function safeRedirect(url?: string | null) {
  if (!url) return "/dashboard";
  try {
    const u = new URL(url, "http://localhost");
    if (u.pathname.startsWith("/login") || u.pathname.startsWith("/register"))
      return "/dashboard";
    return u.pathname + u.search;
  } catch {
    return "/dashboard";
  }
}
