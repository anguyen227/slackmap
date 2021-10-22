import admin from 'firebase-admin'

if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        })
    } catch (e: any) {
        console.error('Firebase admin initialization error', e.stack)
    }
}

export default admin
