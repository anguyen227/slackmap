import FirebaseAdmin from 'FirebaseAdmin'

import { Member } from 'models/Member'
import { SystemAdmin } from './System'
import Collection from 'enum/Collection'

class Admin extends SystemAdmin<Member> {
    col = (teamId: string) =>
        FirebaseAdmin.db
            .collection(Collection.Team)
            .doc(teamId)
            .collection(Collection.Member) as FirebaseFirestore.CollectionReference<Member>

    doc(teamId: string, id: string) {
        return this.col(teamId).doc(id) as FirebaseFirestore.DocumentReference<Member>
    }
}

export const MemberAdmin = new Admin()
