import type { NextApiHandler } from 'next'

import { apiHandler } from 'api/apiHandler'
import { validateUser } from 'api/validateUser'
import { verifyAdmin } from 'api/verifyAdmin'

import ClientError from 'models/ClientError'
import FirebaseAdmin from 'FirebaseAdmin'

import { ErrorCode } from 'enum/ErrorCode'
import { UserAdmin } from 'DTO/Admin/User'
import { MemberAdmin } from 'DTO/Admin/Member'

const setUpMember: NextApiHandler = async (req, res) => {
    try {
        const { latitude, longitude } = req.body
        const user = await validateUser(req, res)
        const userDoc = await UserAdmin.isExist(UserAdmin.doc(user.uid))

        if (userDoc) {
            // get user slack profile
            const slackResult = await FirebaseAdmin.bolt.client.users.info({
                user: userDoc.userId,
            })

            const { profile, is_admin } = slackResult.user || {}
            const { email, image_1024, display_name } = profile || {}

            // validate email to create account
            if (email) {
                // add member document
                await MemberAdmin.create(
                    MemberAdmin.col(userDoc.teamId),
                    {
                        email,
                        userId: userDoc.userId,
                        avatarUrl: image_1024,
                        displayName: display_name,
                        uid: user.uid,
                        isAdmin: is_admin,
                        lat: typeof latitude === 'number' ? latitude : null,
                        lng: typeof longitude === 'number' ? longitude : null,
                    },
                    userDoc.userId
                )
                await FirebaseAdmin.auth.updateUser(user.uid, {
                    emailVerified: true,
                })
                res.status(200).send(true)
            } else {
                throw new ClientError(
                    400,
                    ErrorCode.InvalidEmail,
                    `Sorry, we're unable to set up account with this email: ${email}`
                )
            }
        } else {
            throw new ClientError(400, ErrorCode.UserNotFound, 'User not found')
        }
    } catch (e) {
        return Promise.reject(e)
    }
}

export default apiHandler({ post: setUpMember }, { noAuthenticate: true }, verifyAdmin)
