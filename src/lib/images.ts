/**
 * Parse turf/ground images from the API response.
 * Images can be: null, a JSON string array, or already an array.
 */
export function parseTurfImages(images: string | string[] | null): string[] {
  if (!images) return [];

  if (Array.isArray(images)) return images;

  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed)) return parsed;
    return [images];
  } catch {
    // If it's a single URL string
    return images.trim() ? [images] : [];
  }
}

/**
 * Get the first image URL or null.
 */
export function getFirstImage(images: string | string[] | null): string | null {
  const parsed = parseTurfImages(images);
  return parsed.length > 0 ? parsed[0] : null;
}
