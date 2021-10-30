import type { NextApiHandler } from 'next'

import { apiHandler } from 'api/apiHandler'
import { verifyAdmin } from 'api/verifyAdmin'

import { UserAdmin } from 'DTO/Admin/User'

const toggleVerified: NextApiHandler = async (req, res) => {
    try {
        // const userRecord = await UserAdmin.createAccount('anh.nguyen@commit.dev', 'sdasfafqweqw')
        const userRecord = await UserAdmin.getBy(UserAdmin.col().where('email', '==', 'anh.nguyen@commit.dev'), 1)
        console.log('userRecord', userRecord)
        res.status(200).send('success')
    } catch (e) {
        return Promise.reject(e)
    }
}

export default apiHandler({ get: toggleVerified }, { noAuthenticate: true }, verifyAdmin)
