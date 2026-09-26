/**
 * Utility functions for optimized PDF loading and streaming.
 */

/**
 * Resolves any PDF URL to the highest-performance CDN URL with CORS support.
 * Automatically transforms DigitalOcean Space origin URLs into the Cloudflare CDN URLs.
 */
export function getOptimizedPdfUrl(fileUrl: string | null | undefined): string {
  if (!fileUrl) return "";

  try {
    let cleanUrl = fileUrl.trim();
    if (cleanUrl.startsWith("http%3A") || cleanUrl.startsWith("https%3A")) {
      cleanUrl = decodeURIComponent(cleanUrl);
    }
    const url = new URL(cleanUrl);

    // Pattern 1: https://fra1.digitaloceanspaces.com/dac/... -> https://dac.fra1.cdn.digitaloceanspaces.com/...
    if (
      url.hostname === "fra1.digitaloceanspaces.com" &&
      url.pathname.startsWith("/dac/")
    ) {
      const pathWithoutBucket = url.pathname.replace(/^\/dac\//, "/");
      return `https://dac.fra1.cdn.digitaloceanspaces.com${pathWithoutBucket}${url.search}`;
    }

    // Pattern 2: https://dac.fra1.digitaloceanspaces.com/... -> https://dac.fra1.cdn.digitaloceanspaces.com/...
    if (url.hostname === "dac.fra1.digitaloceanspaces.com") {
      return `https://dac.fra1.cdn.digitaloceanspaces.com${url.pathname}${url.search}`;
    }

    // If it's already on the CDN or another domain, return as-is
    return cleanUrl;
  } catch {
    return fileUrl || "";
  }
}

/**
 * Generates a local Next.js proxy URL with Range support as a fallback if direct CDN cannot be reached.
 */
export function getProxyPdfUrl(fileUrl: string | null | undefined): string {
  if (!fileUrl) return "";
  const optimized = getOptimizedPdfUrl(fileUrl);
  return `/api/proxy-pdf?url=${encodeURIComponent(optimized)}`;
}
