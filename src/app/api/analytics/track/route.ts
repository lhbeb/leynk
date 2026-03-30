import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendTelegramMessage, formatPageViewNotification } from '@/lib/telegram';

const supabaseUrl = 'https://rwevvpdpguhincowygzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3ZXZ2cGRwZ3VoaW5jb3d5Z3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDg1MTQsImV4cCI6MjA3ODEyNDUxNH0.W-2ECC9vNHaOC0lP8BntGUM4StaseOl-nAwtmCKsxl0';

const supabase = createClient(supabaseUrl, supabaseKey);

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
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        headers: {
          'User-Agent': 'Leynk Analytics',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();

        // Check if we got an error response
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
      // Ignore abort errors and try fallback
      if (ipapiError.name !== 'AbortError') {
        console.warn('ipapi.co failed, trying fallback:', ipapiError);
      }

      // Fallback to ip-api.com (free tier: 45 requests/minute)
      try {
        const fallbackController = new AbortController();
        const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 5000);

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
        // Ignore abort errors
        if (fallbackError.name !== 'AbortError') {
          console.warn('Fallback IP API also failed:', fallbackError);
        }
      }
    }

    // If all APIs fail, return unknown
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
    const { username } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Get client information
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || null;

    // Server-side deduplication: Check if we've tracked this view recently (within last 10 seconds)
    // This prevents duplicate tracking from rapid requests or network retries
    // Shorter window allows legitimate page refreshes to be tracked
    const tenSecondsAgo = new Date();
    tenSecondsAgo.setSeconds(tenSecondsAgo.getSeconds() - 10);

    const { data: recentViews, error: checkError } = await supabase
      .from('page_views')
      .select('id')
      .eq('username', username)
      .eq('ip_address', ip)
      .gte('viewed_at', tenSecondsAgo.toISOString())
      .limit(1);

    if (checkError) {
      console.error('Error checking for duplicate views:', checkError);
      // Continue with tracking even if check fails
    } else if (recentViews && recentViews.length > 0) {
      // Duplicate view detected within 10 seconds, return success without inserting
      // This catches rapid duplicate requests while allowing legitimate refreshes
      return NextResponse.json({
        success: true,
        id: recentViews[0].id,
        duplicate: true
      });
    }

    // Get location from IP
    const location = await getLocationFromIP(ip);

    // Insert page view into database
    const { data, error } = await supabase
      .from('page_views')
      .insert({
        username,
        ip_address: ip,
        country: location.country,
        country_code: location.country_code,
        city: location.city,
        user_agent: userAgent,
        referrer: referrer,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting page view:', error);
      return NextResponse.json(
        { error: 'Failed to track page view' },
        { status: 500 }
      );
    }

    // Send Telegram notification for page view (don't wait for it to complete)
    if (TELEGRAM_CHAT_ID) {
      const notificationMessage = formatPageViewNotification({
        username,
        userIp: ip,
        country: location.country || undefined,
        countryCode: location.country_code || undefined,
        city: location.city || undefined,
        referrer: referrer,
      });

      // Send notification asynchronously (don't block the response)
      sendTelegramMessage(TELEGRAM_CHAT_ID, notificationMessage, 'HTML').catch((error) => {
        console.error('Failed to send Telegram notification for page view:', error);
      });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('Error in analytics track endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow GET for CORS preflight if needed
export async function GET() {
  return NextResponse.json({ message: 'Analytics tracking endpoint' });
}

