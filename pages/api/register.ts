import type { NextApiHandler, NextApiRequest } from 'next'

import { apiHandler } from 'api/apiHandler'
import { verifyAdmin } from 'api/verifyAdmin'

import ClientError from 'models/ClientError'
import FirebaseAdmin from 'FirebaseAdmin'

import { ErrorCode } from 'enum/ErrorCode'
import { verifySlack } from 'api/verifySlack'

import { UserAdmin } from 'DTO/Admin/User'
import { TeamAdmin } from 'DTO/Admin/Team'
import { MemberAdmin } from 'DTO/Admin/Member'

const register: NextApiHandler = async (req, res) => {
    try {
        const { team_id, user_id } = req.body || {}

        if (team_id && user_id) {
            const user = await UserAdmin.get(UserAdmin.doc(user_id))
            if (user) {
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
        const team = await TeamAdmin.get(TeamAdmin.doc(team_id))
        if (!team) {
            await TeamAdmin.create(
                TeamAdmin.col(),
                {
                    team_domain,
                },
                team_id
            )
        }

        // get user slack profile
        const slackResult = await FirebaseAdmin.bolt.client.users.info({
            user: user_id,
        })

        const { profile, is_admin } = slackResult.user || {}
        const { email, image_1024, display_name } = profile || {}

        // validate email to create account
        if (email) {
            try {
                // create user account
                const password = Math.random().toString(36).slice(-8)
                const userRecord = await UserAdmin.createAccount(email, password)

                await UserAdmin.create(
                    UserAdmin.col(),
                    {
                        teams: [
                            {
                                team_id,
                                user_id,
                            },
                        ],
                        initialized: false,
                        default_team: [team_id, user_id],
                        email,
                    },
                    userRecord.uid
                )

                // add member document
                await MemberAdmin.create(
                    MemberAdmin.col(team_id),
                    {
                        avatar_url: image_1024,
                        display_name: display_name,
                        uid: userRecord.uid,
                        is_admin,
                    },
                    user_id
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
            } catch (e) {
                const err = e as ClientError
                if (err.code === 'auth/email-already-exists') {
                    const memberRecord = await MemberAdmin.get(MemberAdmin.doc(team_id, user_id))
                    if (memberRecord) {
                        FirebaseAdmin.bolt.client.chat.postMessage({
                            channel: channel_id,
                            blocks: [
                                {
                                    type: 'section',
                                    text: {
                                        type: 'mrkdwn',
                                        text: `You already registered account associated with this team. Please log in with your credential`,
                                    },
                                },
                            ],
                        })
                    } else {
                        // add member document
                        const userRecord = await UserAdmin.getBy(UserAdmin.col().where('email', '==', email), 1)
                        if (userRecord?.[0]._id) {
                            await UserAdmin.doc(userRecord?.[0]._id).update({
                                teams: UserAdmin.addToArray({
                                    team_id,
                                    user_id,
                                }),
                            })
                            // add member document
                            await MemberAdmin.create(
                                MemberAdmin.col(team_id),
                                {
                                    avatar_url: image_1024,
                                    display_name: display_name,
                                    uid: userRecord?.[0]._id,
                                    is_admin,
                                },
                                user_id
                            )
                            FirebaseAdmin.bolt.client.chat.postMessage({
                                channel: channel_id,
                                blocks: [
                                    {
                                        type: 'section',
                                        text: {
                                            type: 'mrkdwn',
                                            text: `Successfully regiter with this team. You can log in with current credential`,
                                        },
                                    },
                                ],
                            })
                        } else {
                            FirebaseAdmin.bolt.client.chat.postMessage({
                                channel: channel_id,
                                blocks: [
                                    {
                                        type: 'section',
                                        text: {
                                            type: 'mrkdwn',
                                            text: `Your email has been registered; however, we are unable to locate it. Please email to our admin for further support`,
                                        },
                                    },
                                ],
                            })
                        }
                    }
                }
            }
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
