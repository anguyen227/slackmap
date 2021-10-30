import { SystemApp } from './System'
import Collection from 'enum/Collection'
import { User } from 'models/User'
import { Location } from 'models/Location'
import axios from 'api/axios'
import { AxiosResponse } from 'axios'

class App extends SystemApp<User> {
    col() {
        return this._col(Collection.User)
    }

    doc(id: string) {
        return this._doc(Collection.User, id)
    }

    async setUp(location: Location) {
        return await axios().request<Location, AxiosResponse<User>>({
            url: '/user/set-up',
            method: 'POST',
            data: location,
        })
    }
}

export const UserApp = new App()
