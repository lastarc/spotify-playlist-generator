import type { NextApiRequest, NextApiResponse } from 'next'
import Spotify from '../../lib/spotify'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.cookies.access_token) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  if (typeof req.query.q !== 'string') {
    return res.status(400).json({ error: '`q` parameter absent' })
  }

  const spotify = new Spotify({
    access_token: req.cookies.access_token,
  })

  const result = await spotify.search(req.query.q)

  res.status(200).json(result.tracks)
}
