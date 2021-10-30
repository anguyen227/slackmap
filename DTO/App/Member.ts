import { SystemApp } from './System'
import Collection from 'enum/Collection'
import { Member } from 'models/Member'

class App extends SystemApp<Member> {
    col(teamId: string) {
        return this._col(Collection.Team, teamId, Collection.Member)
    }

    doc(teamId: string, id: string) {
        return this._doc(Collection.Team, teamId, Collection.Member, id)
    }
}

export const MemberApp = new App()
