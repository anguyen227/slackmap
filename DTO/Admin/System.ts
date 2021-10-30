import { System } from 'models/System'
import FirebaseAdmin from 'FirebaseAdmin'

// FIREBASE ADMIN FUNCTIONS
export abstract class SystemAdmin<D extends System = Record<string, unknown>> {
    dataConverter: FirebaseFirestore.FirestoreDataConverter<D> | null = {
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

    /*  collection ref */
    abstract col(...args: any[]): FirebaseFirestore.CollectionReference<D>
    /*  document ref */
    abstract doc(...args: any[]): FirebaseFirestore.DocumentReference<D>

    addToArray(...elements: any[]) {
        return FirebaseAdmin.app.firestore.FieldValue.arrayUnion(...elements)
    }

    removeFromArray(...elements: any[]) {
        return FirebaseAdmin.app.firestore.FieldValue.arrayRemove(...elements)
    }

    /* check document existence   */
    async get(docRef: FirebaseFirestore.DocumentReference<D>) {
        try {
            const doc = await docRef.get()
            if (doc.exists) {
                return doc.data()
            }
            return null
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async iterateQuery(snapshot: FirebaseFirestore.QuerySnapshot<D>): Promise<D[]> {
        return new Promise((resolve) => {
            let data: D[] = []
            snapshot.forEach((doc) => {
                data.push(doc.data())
            })
            resolve(data)
        })
    }

    async getBy(docQuery: FirebaseFirestore.Query<D>, limit?: number) {
        try {
            let query = docQuery
            if (limit) query = query.limit(limit)
            const doc = await query.get()
            if (doc.empty) {
                return null
            }
            return await this.iterateQuery(doc)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getByPath(path: string) {
        try {
            const doc = await FirebaseAdmin.db.doc(path).get()
            if (doc.exists) {
                return doc.data()
            }
            return null
        } catch (e) {
            return Promise.reject(e)
        }
    }

    /* create document  */
    async create(colRef: FirebaseFirestore.CollectionReference<D>, data: D, id?: string) {
        if (!id) return await colRef.add({ ...data, created_at: new Date() })
        return await colRef.doc(id).set({ ...data, created_at: new Date() })
    }

    async update(
        docRef: FirebaseFirestore.DocumentReference<D>,
        data: FirebaseFirestore.UpdateData,
        precondition?: FirebaseFirestore.Precondition
    ) {
        return await docRef.update({ ...data, updated_at: new Date() }, precondition)
    }
}
