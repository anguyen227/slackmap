import type { NextApiRequest, NextApiResponse } from 'next'

import { validateFirebaseIdToken } from 'services/auth/validateFirebaseIdToken'

/**
 * validate user middleware
 * when fail
 * @param req NextApiRequest
 * @param res NextApiResponse
 */
export const validateUser = async (req: NextApiRequest, res: NextApiResponse) => {
    return await validateFirebaseIdToken(req)
}
