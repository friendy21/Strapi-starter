import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStrapiURL() {
  // During Docker build, SKIP_STATIC_GENERATION=true and STRAPI_BASE_URL is empty
  // Return empty string to signal SDK should not initialize
  if (process.env.SKIP_STATIC_GENERATION === 'true') {
    return "";
  }
  // At runtime or local dev, use the actual URL or fallback to localhost
  return process.env.STRAPI_BASE_URL || "http://localhost:1337";
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${getStrapiURL()}${url}`;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
