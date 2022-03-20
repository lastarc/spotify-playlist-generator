import type { NextApiRequest, NextApiResponse } from 'next'
import Spotify from '../../lib/spotify';
import { serialize } from 'cookie'
import config from '../../config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.code || typeof req.query.code !== 'string') {
    return res.status(500).send('Internal Server Error')
  }

  const spotify = new Spotify({
    client_id: config.spotifyClientId,
    client_secret: config.spotifyClientSecret
  })

  const {
    access_token,
    expires_in,
    // refresh_token,
  } = await spotify.get_tokens({ code: req.query.code })

  res.setHeader(
    'Set-Cookie',
    serialize('access_token', access_token, {
      secure: config.env === 'production',
      httpOnly: true,
      path: '/',
      maxAge: expires_in,
    })
  )

  // res.setHeader(
  //   'Set-Cookie',
  //   serialize('refresh_token', refresh_token, {
  //     secure: config.env === 'production',
  //     httpOnly: true,
  //     path: '/',
  //     maxAge: 6 * 30 * 24 * 60 * 60, // ~6 months
  //   })
  // )

  res.redirect('/')
}
