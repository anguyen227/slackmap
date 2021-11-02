import ClientError from 'models/ClientError'
import { NextApiResponse } from 'next'

export const errorHandler = (error: any, res: NextApiResponse) => {
    const err = JSON.stringify(error, null, 4)
    console.log('Error', err)
    if (error instanceof ClientError) {
        res.status(error.statusCode ?? 400).send(err)
    } else {
        res.status(500).send(err)
    }
}
