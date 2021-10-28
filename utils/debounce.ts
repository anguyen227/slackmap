export default function debounce<T = any, R extends (this: T, ...args: any) => void = () => void>(
    handler: R,
    delay?: number
) {
    let timeout: NodeJS.Timeout | null
    const callback = function (this: T, ...args: Parameters<R>) {
        if (typeof delay === 'number') {
            if (timeout !== null) clearTimeout(timeout)
            timeout = setTimeout(() => {
                handler.apply(this, args)
            }, delay)
        } else {
            handler.apply(this, args)
        }
    }

    return callback
}
