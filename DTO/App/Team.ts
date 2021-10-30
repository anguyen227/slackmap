import { SystemApp } from './System'
import Collection from 'enum/Collection'
import { Team } from 'models/Team'

class App extends SystemApp<Team> {
    col() {
        return this._col(Collection.Team)
    }

    doc(id: string) {
        return this._doc(Collection.Team, id)
    }
}

export const TeamApp = new App()
