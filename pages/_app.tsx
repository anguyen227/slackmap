import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import { CacheProvider, EmotionCache } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useEffect } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

import theme from 'theme'
import createEmotionCache from 'utils/createEmotionCache'
import { useLocalStorage } from 'react-hooks'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout<NextPage>
    emotionCache: EmotionCache
}

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => page)
    const [themeMode] = useLocalStorage<'light' | 'dark'>('theme-mode', 'light')

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement?.removeChild?.(jssStyles)
        }
    }, [])

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
            </Head>
            <ThemeProvider theme={theme(themeMode)}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
        </CacheProvider>
    )
}
export default MyApp
