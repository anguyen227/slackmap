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

            <LoadingScreen>home page</LoadingScreen>
        </AppContainer>
    )
}

export default Home

export const getServerSideProps = async (ctx: any) => {
    return {
        props: {} as never,
    }
}
