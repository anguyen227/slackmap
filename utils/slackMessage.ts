import type { ChatPostMessageArguments } from '@slack/web-api'
import FirebaseAdmin from 'FirebaseAdmin'

export const slackMessage = (options: ChatPostMessageArguments) => {
    return FirebaseAdmin.bolt.client.chat.postMessage(options)
}
