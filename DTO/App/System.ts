import type { CollectionReference, DocumentReference, FirestoreDataConverter } from 'firebase/firestore'
import { getDoc } from 'firebase/firestore'
import { System } from 'models/System'

// FIREBASE WEB FUNCTIONS
export abstract class SystemApp<D extends System = Record<string, unknown>> {
    dataConverter: FirestoreDataConverter<D> | null = null

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
