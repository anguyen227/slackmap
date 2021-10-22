import type { NextApiRequest, NextApiResponse } from 'next'

import admin from 'firebaseAdmin'

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).send('hello')
}
