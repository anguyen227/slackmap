import type { NextPage } from 'next'

import AppContainer from 'components/AppContainer'
import verifyAuth from 'services/auth/verifyAuth'

const Home: NextPage = () => {
    return <AppContainer title='Slack Map'>map</AppContainer>
}

export default Home

export const getServerSideProps = async (ctx: any) => {
    return {
        props: {
            protectPage: true,
        },
    }
}
