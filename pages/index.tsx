import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

import AppContainer from 'components/AppContainer'
import verifyAuth from 'services/auth/verifyAuth'

const Map = dynamic(() => import('components/Map'), {
    loading: () => <>{'Loading...'}</>,
    ssr: false,
})

const Home: NextPage = () => {
    return (
        <AppContainer title='Slack Map'>
            <Map />
        </AppContainer>
    )
}

export default Home

export const getServerSideProps = async (ctx: any) => {
    try {
        await verifyAuth(ctx)
        return {
            props: {
                protectPage: true,
            },
        }
    } catch {
        return {}
    }
}
