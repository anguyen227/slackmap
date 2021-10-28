import type { NextApiRequest, NextApiResponse } from 'next'

import * as crypto from 'crypto'
import tsscmp from 'tsscmp'
import ClientError from 'DTO/ClientError'
import { ErrorCode } from 'enum/ErrorCode'

/**
 * validate slack request
 */
export const verifySlack = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // get signature and timestamp from headers
        const requestSignature = req.headers['x-slack-signature'] as string
        const requestTimestamp = req.headers['x-slack-request-timestamp']

        const [version, requestHash] = requestSignature.split('=')

        const body = new URLSearchParams(req.body).toString()

        // update with slack request
        const base = `${version}:${requestTimestamp}:${body}`

        // create HMAC hash
        const hash = crypto
            .createHmac('sha256', process.env.SLACK_SIGNING_SECRET as string)
            .update(base)
            .digest('hex')

        if (tsscmp(requestHash, hash)) {
            return
        } else {
            throw new ClientError(403, ErrorCode.SlackUnauthenticate, `YOu're not a slack user`)
        }
    } catch (err) {
        return Promise.reject(err)
    }
}
