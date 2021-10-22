import type { GetServerSidePropsContext } from 'next'
import { getCookies } from 'cookies-next'
import admin from 'firebaseAdmin'

type Options = {
    redirectUrl: string
}
/**
 * authentication middleware server side
 * when fail, response is rewritten to redirect to @param {opts.redirectUrl}
 * @param ctx GetServerSidePropsContext
 * @param opts options to handle when fail to authenticate
 * @returns user token object
 */
const verifyAuth = async (
    ctx: GetServerSidePropsContext,
    opts: Options = {
        redirectUrl: '/login',
    }
) => {
    try {
        const cookies = getCookies(ctx)
        const token = await admin.auth().verifyIdToken(cookies.token)
        // `as never` prevents inference issues
        // with InferGetServerSidePropsType.
        // The props returned here don't matter because we've
        // already redirected the user.
        return { verified: !!token.uid }
        // as never }
    } catch (e) {
        ctx.res.writeHead(302, {
            Location: `${opts.redirectUrl}?${new URLSearchParams({
                returnUrl: ctx.req.url as string,
            }).toString()}`,
        })
        ctx.res.end()
        return Promise.reject()
    }
}

export default verifyAuth
