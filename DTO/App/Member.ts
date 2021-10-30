import { QueryDocumentSnapshot } from 'firebase/firestore'

import { SystemApp } from './System'
import Collection from 'enum/Collection'
import { Member } from 'models/Member'

export interface GeoData<P = any> {
    type: 'Feature'
    geometry: {
        type: 'Point'
        coordinates: [number, number]
    }
    properties?: P
}
class App extends SystemApp<Member> {
    col(teamId: string) {
        return this._col(Collection.Team, teamId, Collection.Member)
    }

    doc(teamId: string, id: string) {
        return this._doc(Collection.Team, teamId, Collection.Member, id)
    }

    toGeoJSON(snapshot: QueryDocumentSnapshot): GeoData {
        const data = snapshot.data()

        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [data.lng, data.lat],
            },
            properties: {
                ...data,
                updated_at: data.updated_at?.toDate?.() ?? null,
                created_at: data.created_at?.toDate?.() ?? null,
                _id: snapshot.id,
            },
        }
    }
}

export const MemberApp = new App()
