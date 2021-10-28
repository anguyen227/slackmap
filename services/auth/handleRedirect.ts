import type { IncomingMessage, ServerResponse } from 'http'
import { NoReturnUrl } from 'utils/constant'

type Context = {
    req?: IncomingMessage
    res?: ServerResponse
}

export const handleRedirect = <C extends Context = Context>(ctx: C, path?: string, noReturn?: boolean) => {
    if (path && path !== ctx.req?.url) {
        const returnUrl = noReturn || NoReturnUrl.includes(ctx.req?.url || '') ? '' : ctx.req?.url
        ctx.res?.writeHead?.(302, {
            Location: path + `${returnUrl ? '?' + new URLSearchParams({ returnUrl }).toString() : ''}`,
        })
        ctx.res?.end?.()
    }
}
