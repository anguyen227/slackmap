import FirebaseAdmin from 'FirebaseAdmin'
import System, { SystemDTO } from './System'
import Collection from 'enum/Collection'

export interface MemberDTO extends SystemDTO {
    email: string
    userId: string
    avatarUrl?: string
    displayName?: string
    uid?: string
    geohash?: string
    lat?: number | null
    lng?: number | null
    isAdmin?: boolean
}

class Member extends System<MemberDTO> {
    _col = (teamId: string) =>
        FirebaseAdmin.db
            .collection(Collection.Team)
            .doc(teamId)
            .collection(Collection.Member) as FirebaseFirestore.CollectionReference<MemberDTO>

    _doc(teamId: string, id: string) {
        return this._col(teamId).doc(id) as FirebaseFirestore.DocumentReference<MemberDTO>
    }
}

export default new Member()
