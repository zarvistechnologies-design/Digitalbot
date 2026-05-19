import { NextResponse } from "next/server"

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#f97316"/>
  <path d="M18 35c0-8 6-14 14-14s14 6 14 14-6 14-14 14-14-6-14-14Z" fill="#fff"/>
  <path d="M24 34h16v4H24v-4Zm3-9h10v4H27v-4Z" fill="#f97316"/>
</svg>`

export function GET() {
  return new NextResponse(faviconSvg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
