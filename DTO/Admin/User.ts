import FirebaseAdmin from 'FirebaseAdmin'

import { SystemAdmin } from './System'
import Collection from 'enum/Collection'
import { User } from 'models/User'

class Admin extends SystemAdmin<User> {
    col = () => FirebaseAdmin.db.collection(Collection.User) as FirebaseFirestore.CollectionReference<User>

    doc(id: string) {
        return this.col().doc(id) as FirebaseFirestore.DocumentReference<User>
    }

    async createAccount(email: string, password: string) {
        return await FirebaseAdmin.auth.createUser({
            email,
            emailVerified: false,
            password,
        })
    }

    async getByPath(team: string, member: string) {
        try {
            const doc = await FirebaseAdmin.db.doc(`${Collection.Team}/${team}/${Collection.Member}/${member}`).get()
            if (doc.exists) {
                return doc.data()
            }
            return null
        } catch (e) {
            return null
        }
    }
}

export const UserAdmin = new Admin()
