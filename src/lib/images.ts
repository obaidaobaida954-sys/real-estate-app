export function getOptimizedImageUrl(url: string | undefined | null, width = 800) {
  if (!url || typeof url !== "string") return url || "";
  try {
    const u = new URL(url);
    // Common CDNs accept `w` or `width` query param — add `w` if not present
    if (!u.searchParams.has("w") && !u.searchParams.has("width")) {
      u.searchParams.set("w", String(width));
    }
    return u.toString();
  } catch {
    // if not a full URL, just return original
    return url;
  }
}
