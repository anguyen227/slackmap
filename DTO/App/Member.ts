import { collection, CollectionReference, doc, DocumentReference, FirestoreDataConverter } from 'firebase/firestore'

import FirebaseApp from 'FirebaseApp'

import { SystemApp } from './System'
import Collection from 'enum/Collection'
import { Member } from 'models/Member'

class App extends SystemApp<Member> {
    col(teamId: string) {
        return collection(FirebaseApp.db, Collection.Team, teamId, Collection.Member) as CollectionReference<Member>
    }

    doc(teamId: string, id: string) {
        return doc(FirebaseApp.db, Collection.Team, teamId, Collection.Member, id).withConverter(
            this.dataConverter as FirestoreDataConverter<Member>
        ) as DocumentReference<Member>
    }
}

export const MemberApp = new App()
