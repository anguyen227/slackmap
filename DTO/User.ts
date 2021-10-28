import Collection from 'enum/Collection'
import FirebaseAdmin from 'FirebaseAdmin'
import System, { SystemDTO } from './System'

export interface UserDTO extends SystemDTO {
    teamId: string
    userId: string
}

class User extends System<UserDTO> {
    _col = () => FirebaseAdmin.db.collection(Collection.User) as FirebaseFirestore.CollectionReference<UserDTO>

    _doc(id: string) {
        return this._col().doc(id) as FirebaseFirestore.DocumentReference<UserDTO>
    }

    createAccount = async (email: string, password: string) => {
        return await FirebaseAdmin.auth.createUser({
            email,
            emailVerified: false,
            password,
        })
    }

    getByPath = async (team: string, member: string) => {
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

export default new User()
