import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')?.replace(/^http(s?):\/\//, '')
  const rootUrl = process.env.ROOT_URL?.replace(/^http(s?):\/\//, '')
  if (
    rootUrl &&
    hostname !== rootUrl &&
    !rootUrl.match(/^((http(s?):\/\/)?)localhost((:[0-9]{1,5})?)$/)
  ) {
    url.host = rootUrl.split(':')[0]
    url.port = rootUrl.split(':')[1] || ''
    return NextResponse.redirect(url)
  }
}
