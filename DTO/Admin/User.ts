import FirebaseAdmin from 'FirebaseAdmin'

import { SystemAdmin } from './System'
import Collection from 'enum/Collection'
import { User } from 'models/User'

class Admin extends SystemAdmin<User> {
    col = () =>
        FirebaseAdmin.db
            .collection(Collection.User)
            .withConverter(
                this.dataConverter as FirebaseFirestore.FirestoreDataConverter<User>
            ) as FirebaseFirestore.CollectionReference<User>

    doc(id: string) {
        return this.col().doc(id)
        //  as FirebaseFirestore.DocumentReference<User>
    }

    async createAccount(email: string, password: string) {
        return await FirebaseAdmin.auth.createUser({
            email,
            password,
        })
    }
}

export const UserAdmin = new Admin()
