import FirebaseApp from 'FirebaseApp'
import { getCookie, setCookies } from 'cookies-next'
import Cookie from 'enum/Cookie'

export const getIdToken = async (token?: string | null, refresh?: boolean) => {
    if (token) {
        setCookies(Cookie.Token, token, {
            path: '/',
        })
    } else {
        setCookies(Cookie.Token, await FirebaseApp.auth.currentUser?.getIdToken(refresh), {
            path: '/',
        })
    }
    console.log('token', getCookie(Cookie.Token))
}
