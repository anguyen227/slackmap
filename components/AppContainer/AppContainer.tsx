import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'

const AppContainer = ({ children, ...customMeta }: AppContainerProps) => {
    const router = useRouter()
    const meta = {
        title: 'Anh Nguyen | Front-end Developer',
        description: `description`,
        image: '/avatar.png',
        type: 'website',
        ...customMeta,
    }
    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <link rel='canonical' href={`${process.env.BASE_URL}${router?.asPath}`} />
                <meta content={meta.description} name='description' />

                <meta property='og:url' content={`${process.env.BASE_URL}${router?.asPath}`} />
                <meta property='og:type' content={meta.type} />
                <meta property='og:site_name' content='Manu Arora' />
                <meta property='og:description' content={meta.description} />
                <meta property='og:title' content={meta.title} />
                <meta property='og:image' content={meta.image} />

                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:site' content='@mannupaaji' />
                <meta name='twitter:title' content={meta.title} />
                <meta name='twitter:description' content={meta.description} />
                <meta name='twitter:image' content={meta.image} />

                {meta.date && <meta property='article:published_time' content={meta.date} />}
            </Head>
            {children}
        </>
    )
}

export default AppContainer
