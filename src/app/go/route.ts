import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('url');

    if (!destination) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Validate it's an actual URL to prevent open redirect abuse
    let targetUrl: string;
    try {
        const parsed = new URL(
            destination.startsWith('http') ? destination : `https://${destination}`
        );
        // Only allow http/https URLs
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        targetUrl = parsed.toString();
    } catch {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Use an HTML meta-refresh redirect instead of a 301/302.
    // This keeps leynk.co as the Referer that the destination site sees,
    // because the browser navigates FROM this leynk.co page TO the destination.
    // A 301/302 redirect would pass through the original Referer header,
    // but a same-window navigation via meta-refresh sets Referer = this page's URL.
    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="0;url=${targetUrl}" />
    <meta name="referrer" content="origin" />
    <script>window.location.replace(${JSON.stringify(targetUrl)});</script>
  </head>
  <body>
    <p>Redirecting to <a href="${targetUrl}">${targetUrl}</a>...</p>
  </body>
</html>`;

    return new NextResponse(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
            // Tell the browser to send the full origin as referrer when leaving this page
            'Referrer-Policy': 'origin',
            'Cache-Control': 'no-store',
        },
    });
}
