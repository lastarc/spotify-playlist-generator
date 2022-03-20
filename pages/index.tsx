import type {GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType, NextPage} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Spotify from '../lib/spotify'
import {MouseEventHandler, useState} from 'react';

export const getServerSideProps: GetServerSideProps = async (context) =>  {
  let user = null

  if (context.req.cookies.access_token) {
    try {
      const spotify = new Spotify({
        access_token: context.req.cookies.access_token
      })
      user = await spotify.get_profile()
    } catch (e) {
      // access_token invalid, do nothing
    }
  }

  return {
    props: { user }
  }
}

const Home: NextPage = ({ user }: any) => {
  const [searchResults, setSearchResults] = useState([]);
  const [tracks, setTracks] = useState<any>([]);
  const search: MouseEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    console.log(e.target)
    const data: {[key: string]: any} = {}
    const fd = new FormData(e.target as any)
    fd.forEach((v, k) => data[k] = v)
    fetch(`/api/search?q=${data.q}`)
      .then(r => r.json())
      .then(r => {
        setSearchResults(r.items)
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Spotify Playlist Generator</title>
        <meta name="description" content="Generate Spotify playlist based of on a list of song names" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>

      <main className={styles.main}>
        {user ?
          (<>
            <h1 className={styles.title}>
              Welcome, {user.display_name}
            </h1>

            <div style={{
              margin: "20px auto"
            }}>
              <input id="track-common" type="text"/>
              <textarea id="track-names" cols={40} rows={15}></textarea>
              <br />
              <button
                onClick={() => {
                  const trackNamesElement = document.querySelector('textarea#track-names') as HTMLTextAreaElement
                  trackNamesElement.removeAttribute('disabled')
                  trackNamesElement.value = ''

                  const trackCommonElement = document.querySelector('input#track-common') as HTMLTextAreaElement
                  trackCommonElement.removeAttribute('disabled')
                  trackCommonElement.value = ''

                  setTracks([])

                  const playlistNameElement = document.querySelector('input#playlist-name') as HTMLInputElement
                  playlistNameElement.value = ''
                }}
              >
                Reset
              </button>
              <button
                onClick={async () => {
                  const trackNamesElement = document.querySelector('textarea#track-names') as HTMLTextAreaElement
                  const trackCommonElement = document.querySelector('input#track-common') as HTMLTextAreaElement
                  trackNamesElement.setAttribute('disabled', '')
                  trackCommonElement.setAttribute('disabled', '')

                  const trackNames = trackNamesElement
                    .value
                    .replace(/\r/, '')
                    .split('\n')
                    .map(i => i.trim())
                    .filter(i => i !== '')
                  const trackCommon = trackCommonElement.value.trim()

                  const tracks = await Promise.all(
                    trackNames
                      .map(i => fetch(`/api/search?q=${encodeURIComponent(i)}${trackCommon ? '+' + encodeURIComponent(trackCommon) : ''}`)
                      .then(r => r.json()))
                  )

                  console.log(tracks
                    .map(i => (i.items?.length > 0) ? i.items[0] : null)
                    .filter(i => i !== null))

                  // trackNamesElement.value =
                  setTracks(
                    tracks
                      .map(i => (i.items?.length > 0) ? i.items[0] : null)
                      // .filter(i => i !== null)
                      // .map(i => i ?
                      //   `${i.name} — ${i.artists.map((j: any) => j.name).join(', ')}` :
                      //   '[Couldn\'t find the track]')
                      // .join('\n')
                  )
                }}
              >
                Find
              </button>
              <div>
                <ul>
                  {tracks.map((i: any, idx: number) => i ?
                    (
                      <li key={idx + '_' + i.id} style={{ lineHeight: "1.5rem" }}>
                        <a href={i.external_urls.spotify} style={{ textDecoration: "underline" }}>
                          {i.name} — {i.artists.map((j: any) => j.name).join(', ')}
                        </a>
                      </li>
                    ) :
                    (
                      <li key={idx} style={{ lineHeight: "1.5rem" }}>
                        [Couldn&apos;t find the track]
                      </li>
                    )
                  )}
                </ul>
                <input id="playlist-name" type="text" />
                <button
                  onClick={() => {
                    if (tracks.length < 1) return
                    const playlistNameElement = document.querySelector('#playlist-name') as HTMLInputElement
                    const uris = tracks
                      .filter((i: any) => i !== null)
                      .map((i: any) => i.uri)
                      .join(',')

                    fetch('/api/playlist', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: playlistNameElement.value,
                        tracks: uris,
                      }),
                    })
                      .then(r => r.json())
                      .then((r) => {
                        alert('Done!')
                      })

                  }}
                >
                  Create
                </button>
              </div>
            </div>

          </>) :
          (<>
            <Link href="/api/login">
              <button>
                Login
              </button>
            </Link>
          </>)
        }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
