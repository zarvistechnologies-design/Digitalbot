import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Patterns from old WordPress malware attacks
const SPAM_URL_PATTERNS = [
  /^\/\d+$/,                    // Pure numbers: /7458723, /94255708
  /^\/\d+\.htm$/,               // Numbers with .htm: /79827225389.htm
  /^\/\d+\.html$/,              // Numbers with .html
  /\/wp-content\//,             // WordPress content paths
  /\/wp-includes\//,            // WordPress includes
  /\/wp-admin\//,               // WordPress admin
  /\/wp-json\//,                // WordPress API
  /\.php$/,                     // PHP files (from old WordPress)
  /\/xmlrpc\.php/,              // Common WordPress attack vector
  /\/wp-login\.php/,            // WordPress login
  /\/administrator\//,          // Admin paths
  /\/phpmyadmin/i,              // Database admin
  /\/trackback\//,              // Old WordPress trackback spam
  /\/feed\//,                   // WordPress feeds (if not used)
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes — redirect to login if no token cookie
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Check if URL matches any spam pattern
  const isSpamUrl = SPAM_URL_PATTERNS.some(pattern => pattern.test(pathname))

  if (isSpamUrl) {
    // Return 410 Gone for old malware URLs (better than 404 for permanent removal)
    // This tells search engines to permanently remove from index
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>410 - Page Permanently Removed</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 600px;
    }
    h1 {
      font-size: 72px;
      margin: 0 0 20px;
      font-weight: 900;
    }
    p {
      font-size: 18px;
      margin: 10px 0;
      opacity: 0.9;
    }
    a {
      display: inline-block;
      margin-top: 30px;
      padding: 12px 30px;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s;
    }
    a:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>410</h1>
    <p><strong>This page has been permanently removed.</strong></p>
    <p>The URL you're trying to access is from an old version of this website and no longer exists.</p>
    <a href="https://digitalbot.ai">Visit Homepage</a>
  </div>
</body>
</html>`,
      {
        status: 410, // 410 Gone - Permanent removal (better than 404 for SEO cleanup)
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000', // Cache 410 responses
          'X-Robots-Tag': 'noindex, nofollow', // Extra instruction for crawlers
        },
      }
    )
  }

  // Allow all other requests to proceed normally
  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
