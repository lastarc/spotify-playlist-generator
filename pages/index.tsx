import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Spotify from '../lib/spotify'
import Generator from '../components/Generator'
import NavBar from '../components/NavBar'
import config from '../config'
import { serialize } from 'cookie'
import { UserProfile } from '../interfaces'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let user = null
  let tokenRefreshed = ''

  if (context.req.cookies.refresh_token && !context.req.cookies.access_token) {
    try {
      const spotify = new Spotify({
        client_id: config.spotifyClientId,
        client_secret: config.spotifyClientSecret,
      })

      const { access_token, expires_in } = await spotify.refresh_token({
        refresh_token: context.req.cookies.refresh_token,
      })

      context.res.setHeader(
        'Set-Cookie',
        serialize('access_token', access_token, {
          secure: config.env === 'production',
          httpOnly: true,
          path: '/',
          maxAge: expires_in,
        })
      )

      tokenRefreshed = access_token
    } catch (e) {
      console.error("Token couldn't be refreshed", e)
      return {
        props: {
          errors: {
            msg: "Token couldn't be refreshed",
          },
        },
      }
    }
  }

  if (context.req.cookies.access_token || tokenRefreshed.length > 0) {
    try {
      const spotify = new Spotify({
        access_token: context.req.cookies.access_token || tokenRefreshed,
      })
      user = await spotify.get_profile()
    } catch (e) {
      // access_token invalid, do nothing
    }
  }

  return {
    props: { user },
  }
}

const Home = ({ user }: { user: UserProfile }) => {
  return (
    <div>
      <Head>
        <title>Spotify Playlist Generator</title>
        <meta
          name="description"
          content="Generate Spotify playlist based of on a list of song names"
        />
        {/*TODO: add favicon*/}
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>

      <NavBar user={user} />

      <main
        style={{
          minHeight: '85vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {user && <Generator user={user} />}
      </main>

      <footer
        style={{
          display: 'flex',
          flex: '1',
          padding: '1rem 0',
          borderTop: '1px solid #eaeaea',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <a
          href="https://github.com/lastarc"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: '1',
          }}
        >
          Developed by Arc
        </a>
      </footer>
    </div>
  )
}

export default Home
