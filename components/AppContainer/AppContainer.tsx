import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'

const AppContainer = ({ children, ...customMeta }: AppContainerProps) => {
    const router = useRouter()
    const meta = {
        title: 'Slack Map',
        description: `description`,
        ...customMeta,
    }
    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <link
                    rel='canonical'
                    href={`${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}${router?.asPath}`}
                />
                <meta content={meta.description} name='description' />
            </Head>
            {children}
        </>
    )
}

export default AppContainer
