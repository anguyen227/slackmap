import { css } from '@emotion/css'

type LoadingScreenP = {}
const LoadingScreen = ({}: LoadingScreenP) => {
    return (
        <div
            className={css({
                alignItems: 'center',
                display: 'flex',
                height: '100vh',
                justifyContent: 'center',
                width: '100%',
            })}>
            loading
        </div>
    )
}

export default LoadingScreen
