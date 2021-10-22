import {
    getAuth,
    Persistence,
    browserLocalPersistence,
    inMemoryPersistence,
    browserSessionPersistence,
    setPersistence,
} from 'firebase/auth'
import { setCookies } from 'cookies-next'
import Cookie from 'enum/Cookie'

const types = {
    [browserLocalPersistence.type]: browserLocalPersistence,
    [inMemoryPersistence.type]: inMemoryPersistence,
    [browserSessionPersistence.type]: browserSessionPersistence,
}

const handleAuthPersistence = async (arg: Persistence | string) => {
    const type = typeof arg === 'string' ? arg : arg?.type
    const t = types?.[type] ?? browserLocalPersistence
    await setPersistence(getAuth(), t)
    setCookies(Cookie.AuthPersistence, t.type)
    return t.type
}

export default handleAuthPersistence
