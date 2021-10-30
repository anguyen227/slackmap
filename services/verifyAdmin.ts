import FirebaseAdmin from 'FirebaseAdmin'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * validate user middleware
 * when fail
 * @param req NextApiRequest
 * @param res NextApiResponse
 */
export const verifyAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
    return await FirebaseAdmin.isInit()
}
