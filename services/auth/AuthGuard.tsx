import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import LoadingScreen from 'components/Loading/LoadingScreen'

import useAuth from './useAuth'
import { NoReturnUrl } from 'utils/constant'

type AuthGuardP = {
    children: React.ReactNode
    /* flag the page require to authenticate to display or not */
    protectPage?: boolean
    /* flag the opposite rule page to #{protectPage}, authenticate user could not access, like Login */
    unProtectPage?: boolean
    /* flag the page is free to access */
    publicPage?: boolean
    /* HTTP status code */
    statusCode?: number
}
const AuthGuard = ({ children, protectPage, unProtectPage, statusCode = 0 }: AuthGuardP) => {
    const router = useRouter()
    const { isAuthenticated, isLoading } = useAuth()

    useEffect(() => {
        if (isLoading || statusCode > 399) return
        if (isAuthenticated) {
            if (unProtectPage) {
                /* if page is protectPage and user authenticate, redirect to homepage */
                router.push({
                    pathname: (router.query?.returnUrl as string) ?? '/',
                })
            }
        } else if (protectPage) {
            /* if page requires authentication, redirect to login page */
            const props = NoReturnUrl.includes(router.asPath) ? {} : { query: { returnUrl: router.asPath } }
            router.push({
                pathname: '/login',
                ...props,
            })
        }
    }, [isAuthenticated, protectPage, unProtectPage, router.asPath])

    if (isLoading) return <LoadingScreen mode='fullScreen' />

    return !protectPage || !!isAuthenticated ? <>{children}</> : null
}

export default AuthGuard
