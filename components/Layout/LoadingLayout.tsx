import { Container, ContainerProps } from '@mui/material'
import LoadingScreen, { LoadingScreenProps } from 'components/Loading/LoadingScreen'

type LoadingLayoutProps = ContainerProps & {
    keepOnLoading?: boolean
    loading?: boolean
    loadingProps?: LoadingScreenProps
}

const LoadingLayout = ({ children, keepOnLoading, loading, loadingProps, ...props }: LoadingLayoutProps) => {
    return (
        <Container {...props}>
            {(keepOnLoading || !loading) && children}
            <LoadingScreen {...loadingProps} loading={loading} />
        </Container>
    )
}

export default LoadingLayout
