export interface SystemDTO {
    created_at?: Date | string | number
    updated_at?: Date | string | number
}

export default abstract class System<D extends SystemDTO = Record<string, unknown>> {
    _create<R extends SystemDTO = Record<string, unknown>>(data: any): R {
        return {
            ...data,
            created_at: new Date(),
        }
    }

    _update<R extends SystemDTO = Record<string, unknown>>(data: any): R {
        return {
            ...data,
            updated_at: new Date(),
        }
    }

    abstract _col(...args: any[]): FirebaseFirestore.CollectionReference<D>
    abstract _doc(...args: any[]): FirebaseFirestore.DocumentReference<D>

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

    async create(colRef: FirebaseFirestore.CollectionReference<D>, data: D, id?: string) {
        if (!id) return await colRef.add(this._create(data))
        return await colRef.doc(id).set(this._create(data))
    }
}
