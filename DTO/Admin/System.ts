import { System } from 'models/System'

// FIREBASE ADMIN FUNCTIONS
export abstract class SystemAdmin<D extends System = Record<string, unknown>> {
    /*  collection ref */
    abstract col(...args: any[]): FirebaseFirestore.CollectionReference<D>
    /*  document ref */
    abstract doc(...args: any[]): FirebaseFirestore.DocumentReference<D>

    /* check document existence   */
    async isExist(docRef: FirebaseFirestore.DocumentReference<D>) {
        try {
            const doc = await docRef.get()
            if (doc.exists) {
                return doc.data()
            }
            return false
        } catch (e) {
            return Promise.reject(e)
        }
    }

    /* create document  */
    async create(colRef: FirebaseFirestore.CollectionReference<D>, data: D, id?: string) {
        if (!id) return await colRef.add({ ...data, created_at: new Date() })
        return await colRef.doc(id).set({ ...data, created_at: new Date() })
    }
}
