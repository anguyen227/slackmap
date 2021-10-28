import type { IncomingMessage } from 'http'
import { getCookies } from 'cookies-next'

import FirebaseAdmin from 'FirebaseAdmin'

import ClientError from 'DTO/ClientError'

import { ErrorCode } from 'enum/ErrorCode'

/**
 * verify firebase user by id token
 * @param ctx
 * @returns user token object
 */
export const validateFirebaseIdToken = async (req: IncomingMessage) => {
    const cookies = getCookies({ req })
    if (
        (!req.headers.authorization || !req.headers.authorization?.startsWith('Bearer ')) &&
        !(cookies && cookies.token)
    ) {
        console.error(
            'No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>',
            'or by passing a "token" cookie.'
        )
        return Promise.reject(new ClientError(403, ErrorCode.Unauthenticate, 'unauthenticated'))
    }

    let idToken
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        // console.log('Found "Authorization" header')
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split(' ')[1]
    } else if (cookies && cookies.token) {
        idToken = cookies.token
    }

    if (idToken) {
        try {
            await FirebaseAdmin.isInit()
            const decodedIdToken = await FirebaseAdmin.auth.verifyIdToken(idToken)
            console.log('ID Token correctly decoded', idToken, decodedIdToken)
            return decodedIdToken
        } catch (err) {
            console.error('Error while verifying Firebase ID token:', err)
            return Promise.reject(new ClientError(403, ErrorCode.Unauthenticate, 'unauthenticated'))
        }
    } else {
        // No cookie
        return Promise.reject(new ClientError(403, ErrorCode.Unauthenticate, 'unauthenticated'))
    }
}
