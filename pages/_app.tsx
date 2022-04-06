import { createTheme, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#044D29',
          },
          secondary: {
            main: '#6000C3',
          },
        },
      })}
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
