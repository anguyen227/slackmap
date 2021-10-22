import type { NextApiRequest, NextApiResponse } from 'next'

const getUser = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).send('hello')
}

export default getUser
