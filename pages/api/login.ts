import type { NextApiRequest, NextApiResponse } from 'next'
import Spotify from '../../lib/spotify'
import config from '../../config'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const spotify = new Spotify({
    client_id: config.spotifyClientId,
    client_secret: config.spotifyClientSecret,
  })

  res.redirect(
    spotify.authorization_url({
      scope: 'playlist-modify-public playlist-modify-private',
    })
  )
}
