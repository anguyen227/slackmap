import { NextApiHandler } from 'next'

import { errorHandler } from './errorHandler'
import { validateUser } from './validateUser'

type Option = {
    noAuthenticate?: boolean
}
export const apiHandler = <V = any>(
    handlers: NextApiHandler<V> | Record<string, NextApiHandler<V>>,
    options?: Option,
    ...middlewares: NextApiHandler[]
): NextApiHandler => {
    return async (req, res) => {
        let handler: NextApiHandler<V>

        if (typeof handlers !== 'function') {
            const method = req.method?.toLowerCase?.() || ''
            handler = handlers[method]
            // check handler supports HTTP method
            if (typeof handler !== 'function') return res.status(405).end(`Method ${req.method} Not Allowed`)
        } else {
            handler = handlers
        }

        try {
            if (!options?.noAuthenticate) {
                // validate user
                await validateUser(req, res)
            }

            for (const middleware of middlewares) {
                await middleware(req, res)
            }

            // route handler
            await handler(req, res)
        } catch (err) {
            // global error handler
            errorHandler(err, res)
        }
    }
}
