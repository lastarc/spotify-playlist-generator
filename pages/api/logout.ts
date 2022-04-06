import type { NextApiRequest, NextApiResponse } from 'next'
import config from '../../config'
import { serialize } from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', [
    serialize('access_token', '', {
      secure: config.env === 'production',
      httpOnly: true,
      path: '/',
    }),
    serialize('refresh_token', '', {
      secure: config.env === 'production',
      httpOnly: true,
      path: '/',
    }),
  ])

  res.redirect('/')
}
