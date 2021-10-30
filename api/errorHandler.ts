import ClientError from 'models/ClientError'
import { NextApiResponse } from 'next'

export const errorHandler = (error: any, res: NextApiResponse) => {
    if (error instanceof ClientError) {
        res.status(error.statusCode ?? 400).send(JSON.stringify(error, null, 4))
    } else {
        res.status(500).send(JSON.stringify(error, null, 4))
    }
}
