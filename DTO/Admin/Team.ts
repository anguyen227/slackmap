import FirebaseAdmin from 'FirebaseAdmin'

import { SystemAdmin } from './System'
import Collection from 'enum/Collection'
import { Team } from 'models/Team'

class Admin extends SystemAdmin<Team> {
    col = () => FirebaseAdmin.db.collection(Collection.Team) as FirebaseFirestore.CollectionReference<Team>

    doc(id: string) {
        return this.col().doc(id) as FirebaseFirestore.DocumentReference<Team>
    }
}

export const TeamAdmin = new Admin()
