import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { collection, getDocs, getDoc, doc } from 'firebase/firestore'

import AppContainer from 'components/AppContainer'
import LoadingScreen from 'components/Loading/LoadingScreen'
import { useEffect } from 'react'
import FirebaseApp from 'FirebaseApp'
import Collection from 'enum/Collection'
import axios from 'api/axios'
import { getIdToken } from 'services/auth/getIdToken'
import useAuth from 'services/auth/useAuth'

// const Map = dynamic(() => import('components/Map'), {
//     loading: () => <>{'Loading...'}</>,
//     ssr: false,
// })

const Home: NextPage = () => {
    const { logout } = useAuth()
    async function getUser() {
        // const uid = FirebaseApp.auth.currentUser?.uid
        const docRef = doc(FirebaseApp.db, Collection.User, 'Xvjbkwevdc4Kuads2wUerKg0so13')
        // if (uid) {
        //     const docRef = doc(FirebaseApp.db, 'cities', 'SF', Collection.User, uid)
        const docSnap = await getDoc(docRef)
        console.log('uid', docSnap.data())
        //     // const user = await getDoc(doc(FirebaseApp.db, Collection.User, uid))
        //     // console.log('user', user)
        // }
    }

    useEffect(() => {
        // console.log('homepage')
        // try {
        //     getUser()
        // } catch (e) {
        //     console.log(JSON.stringify(e, null, 4))
        // }
        // const cols = collection(FirebaseApp.db, Collection.User)
    }, [])

    return (
        <AppContainer title='Slack Map'>
            <button
                onClick={async () => {
                    try {
                        const res = await axios().request({
                            url: '/test',
                            method: 'get',
                        })
                        const token = await getIdToken(null, true)
                        // console.log(res, token)
                    } catch (err) {
                        console.log('err', err)
                    }
                }}>
                toggle verified account
            </button>
            <button
                onClick={() => {
                    logout()
                }}>
                logout
            </button>
            <button
                onClick={() => {
                    getUser()
                }}>
                database test
            </button>
            <LoadingScreen>home page</LoadingScreen>
            {/* <Map /> */}
        </AppContainer>
    )
}

export default Home

export const getServerSideProps = async (ctx: any) => {
    return {
        props: {} as never,
    }
}

// export const getStaticProps = async (ctx: any) => {
//     return {
//         props: {} as never,
//     }
// }
