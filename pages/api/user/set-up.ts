import type { NextApiHandler } from 'next'

import { apiHandler } from 'services/apiHandler'
import { validateUser } from 'services/validateUser'
import { verifyAdmin } from 'services/verifyAdmin'

import ClientError from 'models/ClientError'

import { ErrorCode } from 'enum/ErrorCode'
import { UserAdmin } from 'DTO/Admin/User'
import { MemberAdmin } from 'DTO/Admin/Member'

const setUpMember: NextApiHandler = async (req, res) => {
    try {
        const { latitude, longitude } = req.body
        const user = await validateUser(req, res)
        const userRef = UserAdmin.doc(user.uid)

        if (typeof latitude === 'number' && typeof latitude === 'number') {
            await userRef.set(
                {
                    initialized: true,
                    lat: latitude,
                    lng: longitude,
                },
                { merge: true }
            )
            const record = await UserAdmin.get(userRef)
            if (record?.default_team) {
                await MemberAdmin.doc(...record?.default_team).set(
                    {
                        lat: latitude,
                        lng: longitude,
                    },
                    { merge: true }
                )
            }
            res.status(200).json(record)
        } else {
            throw new ClientError(400, ErrorCode.InvalidLocation, 'Location value is invalid')
        }
    } catch (e) {
        return Promise.reject(e)
    }
}

export default apiHandler({ post: setUpMember }, { noAuthenticate: true }, verifyAdmin)
