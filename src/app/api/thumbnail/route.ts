import { NextRequest, NextResponse } from 'next/server';

// Fetch thumbnail/og image from a URL
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Validate URL
    const urlObj = new URL(url);
    
    // Fetch the page HTML to extract Open Graph image
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      
      // Extract Open Graph image
      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                           html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
      const ogImage = ogImageMatch ? ogImageMatch[1] : null;

      // Extract Twitter Card image as fallback
      const twitterImageMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i) ||
                                html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image["']/i);
      const twitterImage = twitterImageMatch ? twitterImageMatch[1] : null;

      // Resolve relative URLs to absolute
      const resolveUrl = (imageUrl: string | null): string | null => {
        if (!imageUrl) return null;
        // Remove any HTML entities
        const cleanUrl = imageUrl.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
        if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
          return cleanUrl;
        }
        if (cleanUrl.startsWith('//')) {
          return urlObj.protocol + cleanUrl;
        }
        try {
          return new URL(cleanUrl, urlObj.origin).href;
        } catch {
          return null;
        }
      };

      const thumbnail = resolveUrl(ogImage) || resolveUrl(twitterImage);

      if (thumbnail) {
        // Return the thumbnail URL - let the client verify if it loads
        // Server-side verification might fail due to CORS, but client can handle it
        // The client will fallback to favicon if the image fails to load
        return NextResponse.json({ thumbnail, url });
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('Thumbnail fetch timeout:', url);
      } else {
        console.error('Error fetching thumbnail:', fetchError.message);
      }
    }

    // If we couldn't fetch or parse, return null (frontend will use favicon)
    return NextResponse.json({ thumbnail: null, url });
  } catch (error: any) {
    console.error('Error in thumbnail API:', error);
    return NextResponse.json({ 
      thumbnail: null, 
      url,
      error: error.message 
    });
  }
}

