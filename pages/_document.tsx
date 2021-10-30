import { Children } from 'react'
import { ServerStyleSheets } from '@mui/styles'
import createEmotionServer from '@emotion/server/create-instance'
import Document, { Html, Head, Main, NextScript } from 'next/document'

import createEmotionCache from 'utils/createEmotionCache'

import { handleRedirect } from 'services/auth/handleRedirect'
import { validateFirebaseIdToken } from 'services/auth/validateFirebaseIdToken'
import { UserAdmin } from 'DTO/Admin/User'

class MyDocument extends Document {
    render() {
        return (
            <Html lang='en'>
                <Head>
                    <link
                        rel='stylesheet'
                        href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
                    />
                    <link href='https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css' rel='stylesheet' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    const originalRenderPage = ctx.renderPage

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets()

    // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)

    let pageProps: any = {}

    ctx.renderPage = () =>
        originalRenderPage({
            // useful for wrapping the whole react tree
            enhanceApp: (App: any) => (props) => {
                pageProps = props.pageProps ?? {}
                return sheets.collect(<App emotionCache={cache} {...props} />)
            },
            // useful for wrapping in a per-page basis
            // enhanceComponent: (Component) => Component,
        })

    const initialProps = await Document.getInitialProps(ctx)

    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ))

    if (ctx.req && (pageProps.statusCode ?? 0) < 400) {
        const needAuthenticate = pageProps.publicPage
            ? false
            : pageProps.unProtectPage || process.env.NEXT_PUBLIC_PROTECT_ALL || pageProps.protectPage
        if (needAuthenticate) {
            try {
                const res = await validateFirebaseIdToken(ctx.req)
                const { uid } = res
                const user = await UserAdmin.get(UserAdmin.doc(uid))
                if (user?.initialized) {
                    if (pageProps.unProtectPage || ['/set-up-account'].includes(ctx.pathname)) {
                        handleRedirect(ctx, '/', true)
                    }
                } else {
                    handleRedirect(ctx, '/set-up-account', true)
                }
            } catch (e) {
                if (!pageProps.unProtectPage) {
                    handleRedirect(ctx, '/login')
                }
            }
        }
    }

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags, sheets.getStyleElement()],
    }
}
