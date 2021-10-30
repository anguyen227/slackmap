import FirebaseAdmin from 'FirebaseAdmin'

import { SystemAdmin } from './System'
import Collection from 'enum/Collection'
import { Team } from 'models/Team'

class Admin extends SystemAdmin<Team> {
    col = () =>
        FirebaseAdmin.db
            .collection(Collection.Team)
            .withConverter(
                this.dataConverter as FirebaseFirestore.FirestoreDataConverter<Team>
            ) as FirebaseFirestore.CollectionReference<Team>

    doc(id: string) {
        return this.col().doc(id)
    }
}

export const TeamAdmin = new Admin()
