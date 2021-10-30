import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { signInWithEmailAndPassword, signOut, Persistence, UserCredential } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useSafeState, useUpdate } from 'react-hooks'

import handleAuthPersistence from './handleAuthPersistence'
import { getIdToken } from './getIdToken'

import { User } from 'models/User'
import { UserApp } from 'DTO/App/User'
import FirebaseApp from 'FirebaseApp'

type AuthContextProps = {
    login: (email: string, password: string) => Promise<UserCredential>
    logout: () => Promise<void>
    changePersistence: (type: Persistence) => ReturnType<typeof handleAuthPersistence>
    updateUser(user: User | null): void
    uid?: string
    isAuthenticated?: boolean
    isLoading?: boolean
    user: User | null
}

export const AuthContext = createContext<AuthContextProps>({} as any)

type AuthProviderP = {
    children: React.ReactNode
}
export const AuthProvider = ({ children }: AuthProviderP) => {
    const [uid, setUid] = useState<string | undefined>()
    const router = useRouter()
    const [user, setUser] = useSafeState<User | null>(null)
    const [loading, setLoading] = useSafeState(!user)
    const _fetched = useRef(false)

    const login = useCallback(async (email: string, password: string) => {
        return await signInWithEmailAndPassword(FirebaseApp.auth, email, password)
    }, [])

    const logout = useCallback(async () => {
        return await signOut(FirebaseApp.auth)
    }, [])

    const updateUser = useCallback((user: User | null) => {
        setUser(user)
    }, [])

    const fetchUser = async (id: string) => {
        try {
            const user = await UserApp.getDoc(UserApp.doc(id))
            const setUpLink = '/set-up-account'
            if (!user?.initialized && router.asPath !== setUpLink) {
                router.push({
                    pathname: setUpLink,
                })
            } else {
                _fetched.current = true
                setUser(user)
                setLoading(false)
            }
        } catch (err) {
            _fetched.current = true
            setUser(null)
            setLoading(false)
        }
    }

    useEffect(() => {
        // force refresh the token every 10 minutes
        const handle = setInterval(async () => {
            getIdToken(undefined, true)
        }, 10 * 60 * 1000)

        return () => {
            clearInterval(handle)
        }
    }, [])

    useEffect(() => {
        // listen for token changes
        // call setUser and write new token as a cookie
        const unsubscribe = FirebaseApp.auth?.onIdTokenChanged?.(async (arg) => {
            setUid(arg?.uid)
            try {
                getIdToken(arg ? undefined : '')
            } catch (e) {
                console.error(e)
            }
            if (!_fetched.current) {
                if (arg?.uid) {
                    setLoading(true)
                    await fetchUser(arg?.uid)
                } else {
                    setLoading(false)
                }
            }
        })

        return () => {
            unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                uid,
                isLoading: loading,
                isAuthenticated: !!user,
                user,
                updateUser,
                login,
                logout,
                changePersistence: handleAuthPersistence,
            }}>
            {children}
        </AuthContext.Provider>
    )
}
