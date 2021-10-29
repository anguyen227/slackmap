import type { NextApiHandler, NextApiRequest } from 'next'

import { apiHandler } from 'api/apiHandler'
import { verifyAdmin } from 'api/verifyAdmin'

import ClientError from 'models/ClientError'
import FirebaseAdmin from 'FirebaseAdmin'

import { ErrorCode } from 'enum/ErrorCode'
import { verifySlack } from 'api/verifySlack'
import { UserAdmin } from 'DTO/Admin/User'
import { TeamAdmin } from 'DTO/Admin/Team'

const register: NextApiHandler = async (req, res) => {
    try {
        const { team_id, user_id } = req.body || {}

        if (team_id && user_id) {
            const existed = await UserAdmin.isExist(UserAdmin.doc(user_id))
            if (existed) {
                res.status(200).send("You've already been added")
            } else {
                res.status(200).send("Hanging tight!!! I'm setting up account for you....")
                handleRegistration(req)
            }
        } else {
            throw new ClientError(400, ErrorCode.InvalidUserData)
        }
    } catch (e) {
        return Promise.reject(e)
    }
}

export default apiHandler({ post: register }, { noAuthenticate: true }, verifySlack, verifyAdmin)

const handleRegistration = async (req: NextApiRequest) => {
    const { team_id, team_domain, user_id, channel_id } = req.body || {}

    try {
        // check team existence, add if not
        const existed = await TeamAdmin.isExist(TeamAdmin.doc(team_id))
        if (!existed) {
            await TeamAdmin.create(
                TeamAdmin.col(),
                {
                    teamDomain: team_domain,
                },
                team_id
            )
        }

        // get user slack profile
        const slackResult = await FirebaseAdmin.bolt.client.users.info({
            user: user_id,
        })

        const { email } = slackResult.user?.profile || {}

        // validate email to create account
        if (email) {
            // create user account
            const password = Math.random().toString(36).slice(-8)
            const userRecord = await UserAdmin.createAccount(email, password)
            await UserAdmin.create(
                UserAdmin.col(),
                {
                    teamId: team_id,
                    userId: user_id,
                },
                userRecord.uid
            )

            FirebaseAdmin.bolt.client.chat.postMessage({
                channel: channel_id,
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `Your Slack Map account is all set:\nCredential: *[YOUR SLACK EMAIL]/${password}*`,
                        },
                    },
                ],
            })
        } else {
            throw new ClientError(
                400,
                ErrorCode.InvalidEmail,
                `Sorry, we're unable to set up account with this email: ${email}`
            )
        }
    } catch (e) {
        if (e instanceof ClientError) {
            FirebaseAdmin.bolt.client.chat.postMessage({
                channel: channel_id,
                text: e.message,
            })
        }
    }
}
