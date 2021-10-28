import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

import AppContainer from 'components/AppContainer'

// const Map = dynamic(() => import('components/Map'), {
//     loading: () => <>{'Loading...'}</>,
//     ssr: false,
// })

const Home: NextPage = () => {
    return (
        <AppContainer title='Slack Map'>
            home page
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
