import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, formatSubscriptionNotification } from '@/lib/telegram';

// Telegram Group Chat ID
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1002806502052';

// Free IP Geolocation API (ipapi.co with fallback)
async function getLocationFromIP(ip: string): Promise<{
  country: string | null;
  country_code: string | null;
  city: string | null;
}> {
  try {
    // Skip localhost and private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.') || ip === '::ffff:127.0.0.1') {
      return {
        country: 'Local',
        country_code: 'LOC',
        city: 'Local',
      };
    }

    // Try ipapi.co first (free tier: 1000 requests/day)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        headers: {
          'User-Agent': 'Leynk Analytics',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();

        if (data.error) {
          throw new Error(data.reason || 'IP API error');
        }

        return {
          country: data.country_name || 'Unknown',
          country_code: data.country_code || 'UN',
          city: data.city || 'Unknown',
        };
      }
    } catch (ipapiError: any) {
      if (ipapiError.name !== 'AbortError') {
        console.warn('ipapi.co failed, trying fallback:', ipapiError);
      }

      // Fallback to ip-api.com
      try {
        const fallbackController = new AbortController();
        const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 3000);

        const fallbackResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,city`, {
          signal: fallbackController.signal,
        });

        clearTimeout(fallbackTimeoutId);

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();

          if (fallbackData.status === 'success') {
            return {
              country: fallbackData.country || 'Unknown',
              country_code: fallbackData.countryCode || 'UN',
              city: fallbackData.city || 'Unknown',
            };
          }
        }
      } catch (fallbackError: any) {
        if (fallbackError.name !== 'AbortError') {
          console.warn('Fallback IP API also failed:', fallbackError);
        }
      }
    }

    return {
      country: 'Unknown',
      country_code: 'UN',
      city: 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching IP location:', error);
    return {
      country: 'Unknown',
      country_code: 'UN',
      city: 'Unknown',
    };
  }
}

// Get client IP address from request
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP (order matters - most reliable first)
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare (most reliable)
  const realIP = request.headers.get('x-real-ip');
  const forwarded = request.headers.get('x-forwarded-for');
  const forwardedFor = request.headers.get('x-forwarded');
  const clientIP = request.headers.get('client-ip');

  // Cloudflare provides the real client IP
  if (cfConnectingIP) {
    const ip = cfConnectingIP.split(',')[0].trim();
    if (ip) return ip;
  }

  // X-Real-IP is often used by proxies
  if (realIP) {
    const ip = realIP.split(',')[0].trim();
    if (ip) return ip;
  }

  // X-Forwarded-For can contain multiple IPs, take the first one
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim();
    if (ip && !ip.startsWith('::ffff:')) {
      return ip;
    }
    // Handle IPv4-mapped IPv6 addresses
    if (ip && ip.startsWith('::ffff:')) {
      return ip.replace('::ffff:', '');
    }
  }

  // Other common headers
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0].trim();
    if (ip) return ip;
  }

  if (clientIP) {
    const ip = clientIP.split(',')[0].trim();
    if (ip) return ip;
  }

  // Last resort fallback
  return 'Unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email } = body;

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get client information
    const ip = getClientIP(request);

    // Get location from IP
    const location = await getLocationFromIP(ip);

    // Send Telegram notification
    if (!TELEGRAM_CHAT_ID) {
      console.warn('Telegram chat ID not configured. Set TELEGRAM_CHAT_ID environment variable or hardcode it in the file.');
      return NextResponse.json(
        { error: 'Telegram chat ID not configured' },
        { status: 500 }
      );
    }

    const notificationMessage = formatSubscriptionNotification({
      username,
      email,
      userIp: ip,
      country: location.country || undefined,
      countryCode: location.country_code || undefined,
      city: location.city || undefined,
    });

    // Send notification (don't wait for it to complete to avoid blocking)
    const telegramSent = await sendTelegramMessage(TELEGRAM_CHAT_ID, notificationMessage, 'HTML');

    if (!telegramSent) {
      console.error('Failed to send Telegram notification');
      // Still return success to the user even if Telegram fails
      // You might want to log this for monitoring
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription successful'
    });
  } catch (error: any) {
    console.error('Error in subscription endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow GET for CORS preflight if needed
export async function GET() {
  return NextResponse.json({ message: 'Subscription endpoint' });
}

