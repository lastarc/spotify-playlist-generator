import axios from 'axios'
import config from '../config'
import type { UserProfile } from '../interfaces'

const authorize_url = 'https://accounts.spotify.com/authorize'
const token_url = 'https://accounts.spotify.com/api/token'
const web_api_url = 'https://api.spotify.com/v1'
const return_uri = config.returnUri

export default class Spotify {
  private readonly client_id: string
  private readonly client_secret: string
  private readonly access_token: string

  constructor({ client_id = '', client_secret = '', access_token = '' }) {
    this.client_id = client_id
    this.client_secret = client_secret
    this.access_token = access_token
  }

  authorization_url({ state = '', scope = '' }) {
    const url = new URL(authorize_url)
    url.searchParams.append('client_id', this.client_id)
    url.searchParams.append('response_type', 'code')
    url.searchParams.append('redirect_uri', return_uri)
    url.searchParams.append('state', state)
    url.searchParams.append('scope', scope)
    url.searchParams.append('show_dialog', 'true')
    return url.toString()
  }

  async get_tokens({ code = '' }) {
    const authorization_token = Buffer.from(
      `${this.client_id}:${this.client_secret}`
    ).toString('base64')
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', config.returnUri)

    const response = await axios({
      url: token_url,
      method: 'POST',
      headers: {
        Authorization: `Basic ${authorization_token}`,
      },
      data: params,
    })

    return response.data
  }

  async refresh_token({ refresh_token = '' }) {
    const authorization_token = Buffer.from(
      `${this.client_id}:${this.client_secret}`
    ).toString('base64')
    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', refresh_token)

    const response = await axios({
      url: token_url,
      method: 'POST',
      headers: {
        Authorization: `Basic ${authorization_token}`,
      },
      data: params,
    })

    return response.data
  }

  async get_profile() {
    const response = await axios({
      url: web_api_url + '/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
    })

    return response.data as UserProfile
  }

  async search(
    q: string,
    type: 'track' | 'artist' = 'track',
    market?: string,
    limit?: number,
    offset?: number
  ) {
    const url = new URL(web_api_url + '/search')
    url.searchParams.append('q', q)
    url.searchParams.append('type', type)
    market && url.searchParams.append('market', market)
    limit && url.searchParams.append('limit', limit.toString())
    offset && url.searchParams.append('offset', offset.toString())

    const response = await axios({
      url: url.toString(),
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      },
    })

    return response.data
  }

  async create_playlist(
    name: string,
    description?: string,
    isPublic?: boolean
  ) {
    const me = await this.get_profile()
    let playlist: Record<string, any> = { name }
    if (description) playlist = { ...playlist, description }
    if (isPublic) playlist = { ...playlist, isPublic }

    const response = await axios({
      url: web_api_url + `/users/${me.id}/playlists`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(playlist),
    })

    return response.data
  }

  async add_tracks_to_playlist(playlist_id: string, tracks: string[]) {
    const url = new URL(web_api_url + `/playlists/${playlist_id}/tracks`)
    url.searchParams.append('uris', tracks.join(','))
    const response = await axios({
      url: url.toString(),
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    return response.data
  }
}
