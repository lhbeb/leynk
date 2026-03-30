// Utility to get thumbnail URL for a link
export async function getThumbnail(url: string): Promise<string | null> {
  try {
    // Use a simple thumbnail service
    // Option 1: Use Google's favicon service (always works, but just shows favicon)
    const domain = new URL(url).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    // Option 2: Try to fetch from our API (which extracts og:image)
    try {
      const response = await fetch(`/api/thumbnail?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.thumbnail) {
          return data.thumbnail;
        }
      }
    } catch (error) {
      console.error('Error fetching thumbnail from API:', error);
    }

    // Fallback to favicon
    return faviconUrl;
  } catch (error) {
    console.error('Error getting thumbnail:', error);
    return null;
  }
}

// Get a simple favicon as fallback
export function getFavicon(url: string): string {
  try {
    const domain = new URL(url).hostname;
    // Use Google's favicon service with multiple fallback options
    // Option 1: Google's favicon service (most reliable)
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    // If URL parsing fails, return empty string (will show default icon)
    return '';
  }
}

// Alternative favicon services as additional fallbacks
export function getAlternativeFavicon(url: string): string {
  try {
    const domain = new URL(url).hostname;
    // Option 2: Favicon grabber service
    return `https://favicons.githubusercontent.com/${domain}`;
  } catch {
    return '';
  }
}

