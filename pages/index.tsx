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
import { GeoData, MemberApp } from 'DTO/App/Member'
import useCollection from 'hooks/useCollection'
import LoadingLayout from 'components/Layout/LoadingLayout'
import type { MapMembersProps } from 'components/Map/MapMembers'

const Map = dynamic<MapMembersProps>(() => import('components/Map/MapMembers'), {
    loading: () => <LoadingScreen>...map initializing</LoadingScreen>,
    ssr: false,
})

const Home: NextPage = () => {
    const { user } = useAuth()
    const [teamId] = user?.default_team || []

    const { loading, data, fetchDocs } = useCollection<GeoData>(
        teamId
            ? MemberApp.col(teamId).withConverter(
                  MemberApp.dataConverter({
                      fromFirestore: MemberApp.toGeoJSON,
                  })
              )
            : null,
        { loading: true, data: [] }
    )

    useEffect(() => {
        if (teamId) {
            fetchDocs()
        }
    }, [user])

    return (
        <AppContainer title='Slack Map'>
            <LoadingLayout
                loading={loading}
                disableGutters
                maxWidth={false}
                sx={{
                    height: '100vh',
                }}
                loadingProps={{
                    mode: 'fullScreen',
                    children: '...loading teamates',
                }}>
                <Map data={data as any[]} />
            </LoadingLayout>
        </AppContainer>
    )
}

export default Home

export const getServerSideProps = async (ctx: any) => {
    return {
        props: {} as never,
    }
}
