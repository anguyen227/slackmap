import { collection, CollectionReference, doc, DocumentReference, FirestoreDataConverter } from 'firebase/firestore'

import FirebaseApp from 'FirebaseApp'

import { SystemApp } from './System'
import Collection from 'enum/Collection'
import { User } from 'models/User'

class App extends SystemApp<User> {
    col() {
        return collection(FirebaseApp.db, Collection.User) as CollectionReference<User>
    }

    doc(id: string): DocumentReference<User> {
        return doc(FirebaseApp.db, Collection.User, id).withConverter(
            this.dataConverter as FirestoreDataConverter<User>
        )
    }
}

export const UserApp = new App()

