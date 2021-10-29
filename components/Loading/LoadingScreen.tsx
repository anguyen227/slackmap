import { CircularProgress } from '@mui/material'
import { css } from '@emotion/css'
import clsx from 'clsx'

type Mode = 'absolute' | 'relative' | 'fullScreen'
export type LoadingScreenProps = JSX.IntrinsicElements['div'] & {
    mode?: Mode
    overlay?: boolean
    loading?: boolean
}
const modeStyle: Record<Mode, string> = {
    absolute: css({
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
    }),
    relative: css({
        height: '100%',
        width: '100%',
    }),
    fullScreen: css({
        height: '100vh',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
    }),
}

const overLay = css({
    backgroundColor: `rgba(0,0,0,.22)`,
})

const LoadingScreen = ({ children, mode, className, overlay, loading, style, ...props }: LoadingScreenProps) => {
    const visible = typeof loading === 'boolean' ? loading : true
    return visible ? (
        <div
            className={clsx(
                css({ top: 0, left: 0, zIndex: 99, justifyContent: 'center', alignItems: 'center', display: 'flex' }),
                modeStyle[mode ?? 'relative'],
                {
                    [overLay]: overlay,
                },
                className
            )}
            {...props}>
            {children || (
                <>
                    <CircularProgress />
                </>
            )}
        </div>
    ) : null
}

export default LoadingScreen
