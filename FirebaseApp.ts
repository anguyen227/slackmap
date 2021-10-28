// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp as FA } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'
import { getCookie } from 'cookies-next'

import handleAuthPersistence from 'services/auth/handleAuthPersistence'
import Cookie from 'enum/Cookie'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_APPID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
}

export default class FirebaseApp {
    static app: FA
    static db: Firestore
    static auth: Auth
    static async init() {
        if (typeof window !== 'undefined' && !getApps().length) {
            try {
                // Initialize Firebase
                this.app = initializeApp(firebaseConfig)

                this.db = getFirestore()

                this.auth = getAuth()
                handleAuthPersistence(getCookie(Cookie.AuthPersistence) as string)

                if (process.env.NODE_ENV === 'development') {
                    connectFirestoreEmulator(this.db, 'localhost', 8880)
                    connectAuthEmulator(this.auth, 'http://localhost:9099', { disableWarnings: true })
                }
            } catch {}
        }
    }
}
