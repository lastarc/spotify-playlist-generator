import { useState } from 'react'
import type { UserProfile } from '../interfaces'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LoadingButton from '@mui/lab/LoadingButton'
import SearchIcon from '@mui/icons-material/Search'
import SendIcon from '@mui/icons-material/Send'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const Generator = ({ user }: { user: UserProfile }) => {
  const [loading, setLoading] = useState(false)
  const [trackNames, setTrackNames] = useState('')
  const [commonKeyword, setCommonKeyword] = useState('')
  const [playlistName, setPlaylistName] = useState('')
  const [tracks, setTracks] = useState<any>([])
  const [alert, setAlert] = useState<any>(null)

  return (
    <Box
      component="form"
      sx={{
        margin: '20px auto',
        width: '90vw',
        maxWidth: 'min(90vw, 450px)',
      }}
      noValidate
      autoComplete="off"
    >
      <div style={{ display: 'flex', justifyContent: 'right' }}>
        <Button
          disabled={loading}
          size="small"
          onClick={() => {
            setTrackNames((p) =>
              p
                .replace(/\r/g, '')
                .split('\n')
                .map((i) =>
                  i
                    .replace(/feat\.\s|Official\s+Audio|\sAudio\s/gi, '')
                    .replace(/([0-9]|:|\.|\[|\])+/g, '')
                    .replace(/-/g, '')
                    .replace(/\s+/g, ' ')
                    .trim()
                )
                .join('\n')
            )
          }}
        >
          Remove clutter
        </Button>
      </div>
      <Stack spacing={2}>
        <TextField
          id="track-names"
          label="Track names"
          multiline
          minRows={3}
          maxRows={10}
          value={trackNames}
          onChange={(e) => setTrackNames(e.target.value)}
          variant="filled"
          placeholder="A song on each line"
          style={{ width: '100%' }}
          disabled={loading}
        />

        <TextField
          id="common-keyword"
          label="Common keyword"
          value={commonKeyword}
          onChange={(e) => setCommonKeyword(e.target.value)}
          variant="filled"
          placeholder="A common keyword"
          size="small"
          style={{ width: '100%' }}
          disabled={loading}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            startIcon={<ClearIcon />}
            variant="outlined"
            onClick={() => {
              setTrackNames('')
              setCommonKeyword('')
              setTracks([])
              setPlaylistName('')
              setAlert(null)
            }}
          >
            Reset
          </Button>

          <LoadingButton
            loading={loading}
            loadingPosition="end"
            endIcon={<SearchIcon />}
            variant="contained"
            onClick={async () => {
              setLoading(true)

              const titles = trackNames
                .replace(/\r/g, '')
                .split('\n')
                .map((i) => i.trim())
                .filter((i) => i !== '')
              const keyword = commonKeyword.trim()
              const tracks = await Promise.all(
                titles.map((i) =>
                  fetch(
                    '/api/search?q=' +
                      encodeURIComponent(i) +
                      (keyword ? '+' + encodeURIComponent(keyword) : '')
                  ).then((r) => r.json())
                )
              )

              setTracks(
                tracks.map((i) => (i.items?.length > 0 ? i.items[0] : null))
              )

              setLoading(false)
            }}
          >
            Find
          </LoadingButton>
        </div>
      </Stack>

      <div>
        <List>
          {tracks.map((i: any, idx: number) =>
            i ? (
              <ListItem
                key={idx + '_' + i.id}
                alignItems="flex-start"
                disablePadding
              >
                <ListItemButton
                  component="a"
                  href={i.external_urls.spotify}
                  target="_blank"
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={i.name}
                      src={i.album.images[0]?.url}
                      variant="rounded"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={i.name}
                    secondary={
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {i.artists.map((j: any) => j.name).join(', ')}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem key={idx} disablePadding>
                <ListItemButton>
                  <ListItemIcon />
                  <ListItemText primary="[Couldn't find the track]" />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </div>

      <Stack spacing={2}>
        <TextField
          id="playlist-name"
          label="Playlist name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          variant="filled"
          placeholder="Name for the new playlist"
          size="small"
          style={{ width: '100%' }}
          disabled={loading || tracks.filter((i: any) => i).length == 0}
        />
        {alert}
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <LoadingButton
            loading={loading}
            disabled={tracks.filter((i: any) => i).length == 0}
            loadingPosition="end"
            endIcon={<SendIcon />}
            variant="contained"
            onClick={async () => {
              if (tracks.length < 1) return
              const playlistNameElement = document.querySelector(
                '#playlist-name'
              ) as HTMLInputElement
              const uris = tracks
                .filter((i: any) => i !== null)
                .map((i: any) => i.uri)
                .join(',')

              const res = await fetch('/api/playlist', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: playlistNameElement.value,
                  tracks: uris,
                }),
              })
              const json = await res.json()

              console.log(json)

              setAlert(
                <Alert
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  Playlist{' '}
                  <a
                    href={json.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'underline' }}
                  >
                    {json.name}
                  </a>{' '}
                  has been created!
                </Alert>
              )
            }}
          >
            Create
          </LoadingButton>
        </div>
      </Stack>
    </Box>
  )
}

export default Generator
