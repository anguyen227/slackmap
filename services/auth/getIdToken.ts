import FirebaseApp from 'FirebaseApp'
import { setCookies } from 'cookies-next'
import Cookie from 'enum/Cookie'

export const getIdToken = async (token?: string | null, refresh?: boolean) => {
    try {
        const tkn = token ?? (await FirebaseApp.auth.currentUser?.getIdToken(refresh))
        setCookies(Cookie.Token, tkn, {
            path: '/',
        })
        return tkn
    } catch (err) {
        return Promise.reject(err)
    }
}
