import type { NextApiRequest, NextApiResponse } from 'next'
import Spotify from '../../lib/spotify';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.cookies.access_token) {
    return res.status(401).json({error: 'unauthorized'})
  }

  if (req.method !== 'POST') {
    return res.status(400).json({error: 'only `POST` method is allowed'})
  }

  if (typeof req.body.name !== 'string') {
    return res.status(400).json({error: '`name` is absent in body'})
  }

  if (typeof req.body.tracks !== 'string') {
    return res.status(400).json({error: '`tracks` is absent in body'})
  }


  const spotify = new Spotify({
    access_token: req.cookies.access_token
  })

  const playlist = await spotify.create_playlist(req.body.name)
  const addedTracks = await spotify.add_tracks_to_playlist(playlist.id, req.body.tracks.split(','))

  res.status(200).json(addedTracks)
}
