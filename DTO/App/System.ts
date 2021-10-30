import {
    collection,
    CollectionReference,
    doc,
    DocumentReference,
    FirestoreDataConverter,
    getDoc,
} from 'firebase/firestore'
import {} from 'firebase/firestore'
import FirebaseApp from 'FirebaseApp'
import { System } from 'models/System'

// FIREBASE WEB FUNCTIONS
export abstract class SystemApp<D extends System = Record<string, unknown>> {
    dataConverter: FirestoreDataConverter<D> | null = {
        fromFirestore: (snapshot) => {
            const data = snapshot.data()
            return {
                ...data,
                updated_at: data.updated_at?.toDate?.() ?? null,
                created_at: data.created_at?.toDate?.() ?? null,
                _id: snapshot.id,
            } as D
        },
        toFirestore: (data) => {
            return {
                ...data,
                updated_at: new Date(),
            }
        },
    }

    _col(path: string, ...pathSegments: string[]) {
        return collection(FirebaseApp.db, path, ...pathSegments).withConverter(
            this.dataConverter as FirestoreDataConverter<D>
        )
    }

    _doc(path: string, ...pathSegments: string[]) {
        return doc(FirebaseApp.db, path, ...pathSegments).withConverter(this.dataConverter as FirestoreDataConverter<D>)
    }

    /*  collection ref */
    abstract col(...args: string[]): CollectionReference<D>

    /*  document ref */
    abstract doc(...args: string[]): DocumentReference<D>

    /* get document  */
    async getDoc(docRef: DocumentReference<D>) {
        try {
            const doc = await getDoc(docRef)
            if (doc.exists()) {
                return doc.data()
            }
            return null
        } catch (e) {
            return Promise.reject(e)
        }
    }
}
