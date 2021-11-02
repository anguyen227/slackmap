import { App } from '@slack/bolt'
import admin from 'firebase-admin'

import { ErrorCode } from 'enum/ErrorCode'
import ClientError from 'models/ClientError'

class FirebaseAdmin {
    static app: typeof admin
    static db: admin.firestore.Firestore
    static auth: admin.auth.Auth
    static bolt: App
    static initialized: boolean = false

    static async init(): Promise<void> {
        return await new Promise((resolve, reject) => {
            try {
                this.bolt = new App({
                    token: process.env.SLACK_BOT_TOKEN,
                    signingSecret: process.env.SLACK_SIGNING_SECRET,
                })
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
                console.log('serviceAccount', serviceAccount)
                if (!admin.apps.length) {
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
                    })
                }
                this.app = admin
                this.db = admin.firestore()
                this.auth = admin.auth()
                this.initialized = true
                resolve()
            } catch (e) {
                console.error('Firebase admin initialization error', e)
                this.initialized = false
                reject(new ClientError(400, ErrorCode.FirebaseAdminInitFail, 'failed to initialize firebase admin'))
            }
        })
    }

    static async isInit() {
        if (!this.initialized) {
            console.log('Initialize firebase admin')
            return await this.init()
        }
        return
    }
}

export default FirebaseAdmin
