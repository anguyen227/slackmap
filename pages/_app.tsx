import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import { CacheProvider, EmotionCache } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useLocalStorage } from 'react-hooks'
import Head from 'next/head'
import React, { useEffect, useMemo } from 'react'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import FirebaseApp from 'FirebaseApp'

import theme from 'theme'
import createEmotionCache from 'utils/createEmotionCache'
import { AuthProvider } from 'services/auth/AuthProvider'

import AuthGuard from 'services/auth/AuthGuard'

FirebaseApp.init()

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout<NextPage>
    emotionCache: EmotionCache
}

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => page)
    const [themeMode] = useLocalStorage<'light' | 'dark'>('theme-mode', 'light')
    const th = useMemo(() => theme(themeMode), [themeMode])
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
                <meta name='viewport' content='initial-scale=1, width=device-width' />
                {/* PWA primary color */}
                <meta name='theme-color' content={th.palette.primary.main} />
                <meta name='robots' content='follow, index' />
                <link rel='shortcut icon' href='/favicon.ico' />
            </Head>
            <ThemeProvider theme={th}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <AuthProvider>
                    <AuthGuard protectPage={pageProps?.protectPage}>
                        {getLayout(<Component {...pageProps} />)}
                    </AuthGuard>
                </AuthProvider>
            </ThemeProvider>
        </CacheProvider>
    )
}
export default MyApp
