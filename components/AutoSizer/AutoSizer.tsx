/**
 * AutoSizer.
 * https://github.com/bvaughn/react-virtualized/tree/master/source/AutoSizer
 * bvaughn
 *
 * Forked "9.22.3" with modified
 * - rewrite with react hooks in typescript
 **/

import { useCallback, useEffect, useRef, useState } from 'react'

import createDetectElementResize from 'utils/detectElementResize'
import debounce from 'utils/debounce'

type Size = {
    height: number
    width: number
}

type AutoSizerProps = {
    children: ((size: Size) => React.ReactNode) | React.ReactNode

    /** Nonce of the inlined stylesheet for Content Security Policy */
    nonce?: string

    /** Optional custom CSS class name to attach to root AutoSizer element.  */
    className?: string

    /** Default height to use for initial render; useful for SSR */
    defaultHeight?: number

    /** Default width to use for initial render; useful for SSR */
    defaultWidth?: number

    /** Disable dynamic :height property */
    disableHeight?: boolean

    /** Disable dynamic :width property */
    disableWidth?: boolean

    /** Optional inline style */
    style?: React.CSSProperties

    delay?: number

    /** Callback to be invoked on-resize */
    onResize?(size: Size): void
}

type ResizeHandler = (element: HTMLElement, onResize: () => void) => void

type DetectElementResize = {
    addResizeListener: ResizeHandler
    removeResizeListener: ResizeHandler
}

const AutoSizer = ({ children, nonce, onResize, disableWidth, disableHeight, delay, ...props }: AutoSizerProps) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const parent = useRef<HTMLElement>()
    const _window = useRef<any>()
    const detectElementResize = useRef<DetectElementResize | null>()

    const [size, setSize] = useState<Size>({
        width: props.defaultWidth || 0,
        height: props.defaultHeight || 0,
    })
    const sizeRef = useRef<Size>(size)
    sizeRef.current = size
    // Outer div should not force width/height since that may prevent containers from shrinking.
    // Inner component should overflow and use calculated width/height.
    // See issue #68 for more information.
    const childProps: Size = { height: 0, width: 0 }

    if (!disableHeight) {
        childProps.height = size.height
    }

    if (!disableWidth) {
        childProps.width = size.width
    }
    const outerStyle: React.CSSProperties = typeof children === 'function' ? {} : childProps

    const _onResize = useCallback(() => {
        if (parent.current) {
            // Guard against AutoSizer component being removed from the DOM immediately after being added.
            // This can result in invalid style values which can result in NaN values if we don't handle them.
            // See issue #150 for more context.

            const height = parent.current.offsetHeight || 0
            const width = parent.current.offsetWidth || 0

            const win = _window.current || window
            const style = win.getComputedStyle(parent.current) || {}
            const paddingLeft = parseInt(style.paddingLeft, 10) || 0
            const paddingRight = parseInt(style.paddingRight, 10) || 0
            const paddingTop = parseInt(style.paddingTop, 10) || 0
            const paddingBottom = parseInt(style.paddingBottom, 10) || 0

            const newHeight = height - paddingTop - paddingBottom
            const newWidth = width - paddingLeft - paddingRight

            if (
                (!disableHeight && sizeRef.current.height !== newHeight) ||
                (!disableWidth && sizeRef.current.width !== newWidth)
            ) {
                setSize({
                    height: height - paddingTop - paddingBottom,
                    width: width - paddingLeft - paddingRight,
                })

                onResize?.({ height, width })
            }
        }
    }, [onResize, disableHeight, disableWidth])

    useEffect(() => {
        const parentNode = ref.current?.parentNode
        if (
            parentNode?.ownerDocument?.defaultView &&
            parentNode instanceof parentNode?.ownerDocument?.defaultView?.HTMLElement
        ) {
            parent.current = parentNode
            _window.current = parentNode.ownerDocument.defaultView

            detectElementResize.current = createDetectElementResize(nonce, _window.current)

            _onResize()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const _debounceResize = debounce(_onResize, delay)

        if (parent.current) {
            detectElementResize.current?.addResizeListener?.(parent.current, _debounceResize)
        }

        return () => {
            if (parent.current) {
                detectElementResize.current?.removeResizeListener?.(parent.current, _debounceResize)
            }
        }
    }, [_onResize, delay])

    return (
        <div ref={ref} className={'hjkprops.className'} style={{ ...props.style, ...outerStyle }}>
            {typeof children === 'function' ? children(childProps) : children}
        </div>
    )
}

export default AutoSizer
