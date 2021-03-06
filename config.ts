import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export default {
  env: process.env.NODE_ENV || 'development',
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID || '',
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
  returnUri:
    (process.env.ROOT_URL
      ? (process.env.ROOT_URL.startsWith('http')
          ? process.env.ROOT_URL
          : 'http://' + process.env.ROOT_URL) + '/'
      : 'http://localhost:3000/') + 'api/callback/',
}
