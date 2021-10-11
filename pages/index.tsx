import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

import AppContainer from 'components/AppContainer'

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
