import { css } from '@emotion/css'
import clsx from 'clsx'
import { CircularProgress } from '@mui/material'

type Mode = 'absolute' | 'relative' | 'fullScreen'
type LoadingScreenP = {
    children?: React.ReactNode
    mode?: Mode
    className?: string
    style?: React.CSSProperties
    background?: boolean
    loading?: boolean
}
const modeStyle: Record<Mode, React.CSSProperties> = {
    absolute: {
        height: '100%',
        position: 'absolute',
        width: '100%',
    },
    relative: {
        height: '100%',
        width: '100%',
    },
    fullScreen: {
        height: '100vh',
        position: 'fixed',
        width: '100%',
    },
}

const backDrop = css({
    backgroundColor: `rgba(0,0,0,.12)`,
})

const LoadingScreen = ({ children, mode, className, style, background, loading }: LoadingScreenP) => {
    const visible = typeof loading === 'boolean' ? loading : true
    return visible ? (
        <div
            className={clsx(
                css({
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 99,
                    top: 0,
                    left: 0,
                }),
                {
                    [backDrop]: background,
                },
                className
            )}
            style={{ ...modeStyle[mode ?? 'relative'], ...style }}>
            {children || (
                <>
                    <CircularProgress />
                </>
            )}
        </div>
    ) : null
}

export default LoadingScreen
