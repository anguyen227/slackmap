import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import LoadingScreen from 'components/Loading/LoadingScreen'

import useAuth from './useAuth'

type AuthGuardP = {
    children: React.ReactNode
    /* flag the page require to authenticate to display or not */
    protectPage?: boolean
    /* flag the page will not display when authenticated */
    publicPage?: boolean
}
const publicPaths = ['/login']
const AuthGuard = ({ children, protectPage, publicPage }: AuthGuardP) => {
    const router = useRouter()
    const { isAuthenticated, isLoading } = useAuth()

    useEffect(() => {
        if (isLoading) return
        const path = router.asPath.split('?')[0]
        if (protectPage && !isAuthenticated && !publicPaths.includes(path)) {
            /* if page requires authentication, redirect to login page */
            router.push({
                pathname: '/login',
                query: { returnUrl: router.asPath },
            })
        } else if (isAuthenticated && publicPage) {
            /* if page is protectPage and user authenticate, redirect to homepage */
            router.push({
                pathname: (router.query?.returnUrl as string) ?? '/',
            })
        }
    }, [isAuthenticated, protectPage, publicPage, isLoading])

    if (isLoading) return <LoadingScreen />

    return !protectPage || !!isAuthenticated ? <>{children}</> : null
}

export default AuthGuard
