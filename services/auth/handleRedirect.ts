import type { IncomingMessage, ServerResponse } from 'http'

type Context = {
    req?: IncomingMessage
    res?: ServerResponse
}

export const handleRedirect = <C extends Context = Context>(ctx: C, path?: string, noReturn?: boolean) => {
    if (path && path !== ctx.req?.url) {
        const returnUrl = noReturn ? '' : ctx.req?.url
        ctx.res?.writeHead?.(302, {
            Location: path + `${returnUrl ? '?' + new URLSearchParams({ returnUrl }).toString() : ''}`,
        })
        ctx.res?.end?.()
    }
}
