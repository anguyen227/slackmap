import { createContext, useEffect, useState } from 'react'
import { setCookies } from 'cookies-next'
import { signInWithEmailAndPassword, signOut, Persistence, User, UserCredential } from 'firebase/auth'

import handleAuthPersistence from './handleAuthPersistence'
import FirebaseApp from 'FirebaseApp'

type AuthActions = {
    login: (email: string, password: string) => Promise<UserCredential>
    logout: () => Promise<void>
    changePersistence: (type: Persistence) => ReturnType<typeof handleAuthPersistence>
}
type AuthData = {
    currentUser: User | null
    isAuthenticated: boolean
    isLoading: boolean
}

export const AuthContext = createContext<AuthData & AuthActions>({
    currentUser: null,
    isAuthenticated: !!null,
    isLoading: !null,
} as any)

type AuthProviderP = {
    children: React.ReactNode
}
export const AuthProvider = ({ children }: AuthProviderP) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // listen for token changes
        // call setUser and write new token as a cookie
        FirebaseApp.auth?.onIdTokenChanged?.(async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken()
                    setCookies('token', token, {
                        path: '/',
                    })
                } catch (e) {
                    console.error(e)
                }
            } else {
                setCookies('token', '', {
                    path: '/',
                })
            }
            setCurrentUser(user)
            setLoading(false)
        })

        // force refresh the token every 10 minutes
        const handle = setInterval(async () => {
            const user = FirebaseApp.auth?.currentUser
            if (user) await user.getIdToken(true)
        }, 10 * 60 * 1000)

        return () => {
            clearInterval(handle)
        }
    }, [])

    const login = async (email: string, password: string) => {
        return await signInWithEmailAndPassword(FirebaseApp.auth, email, password)
    }

    const logout = async () => {
        return await signOut(FirebaseApp.auth)
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isLoading: loading,
                isAuthenticated: !!currentUser,
                login,
                logout,
                changePersistence: handleAuthPersistence,
            }}>
            {children}
        </AuthContext.Provider>
    )
}
