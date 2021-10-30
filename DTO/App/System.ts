import {
    collection,
    CollectionReference,
    doc,
    DocumentReference,
    FirestoreDataConverter,
    getDoc,
    getDocs,
    QuerySnapshot,
} from 'firebase/firestore'
import FirebaseApp from 'FirebaseApp'
import { System } from 'models/System'

// FIREBASE WEB FUNCTIONS
export abstract class SystemApp<D extends System = Record<string, unknown>> {
    dataConverter<T = D>(converter?: Partial<FirestoreDataConverter<T>>): FirestoreDataConverter<T> {
        return {
            fromFirestore: (snapshot) => {
                const data = snapshot.data()
                return {
                    ...data,
                    updated_at: data.updated_at?.toDate?.() ?? null,
                    created_at: data.created_at?.toDate?.() ?? null,
                    _id: snapshot.id,
                } as unknown as T
            },
            toFirestore: (data) => {
                return {
                    ...(data as any),
                    updated_at: new Date(),
                }
            },
            ...converter,
        }
    }

    _col(path: string, ...pathSegments: string[]) {
        return collection(FirebaseApp.db, path, ...pathSegments).withConverter(this.dataConverter())
    }

    _doc(path: string, ...pathSegments: string[]) {
        return doc(FirebaseApp.db, path, ...pathSegments).withConverter(this.dataConverter())
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

    async iterateQuery(snapshot: QuerySnapshot<D>): Promise<D[]> {
        return new Promise((resolve) => {
            let data: D[] = []
            snapshot.forEach((doc) => {
                data.push(doc.data())
            })
            resolve(data)
        })
    }

    async getDocs(path: string, ...pathSegments: string[]) {
        try {
            const snapshot = await getDocs(this._col(path, ...pathSegments))
            if (snapshot.empty) {
                return null
            }
            return await this.iterateQuery(snapshot)
        } catch (e) {
            return Promise.reject(e)
        }
    }
}
