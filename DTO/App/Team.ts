import { collection, CollectionReference, doc, DocumentReference, FirestoreDataConverter } from 'firebase/firestore'

import FirebaseApp from 'FirebaseApp'

import { SystemApp } from './System'
import Collection from 'enum/Collection'
import { Team } from 'models/Team'

class App extends SystemApp<Team> {
    col() {
        return collection(FirebaseApp.db, Collection.Team) as CollectionReference<Team>
    }

    doc(id: string) {
        return doc(FirebaseApp.db, Collection.Team, id).withConverter(
            this.dataConverter as FirestoreDataConverter<Team>
        ) as DocumentReference<Team>
    }
}

export const TeamApp = new App()
