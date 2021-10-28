/// <reference types="react" />

declare type NextPageWithLayout<P = {}, IP = P> = import('next').NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode
}

declare type AppContainerProps = {
    children?: React.ReactNode
    type?: string
    description?: string
    title?: string
    image?: string
    date?: string
}

declare type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends React.Component<infer TProps, any>
    ? TProps
    : TComponentOrTProps

// turn optional props to required
declare type AsRequired<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Required<Pick<T, K>>
// turn required propt to optional
declare type Optional<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Partial<Pick<T, K>>

declare module 'react-map-gl-geocoder' {
    export default any
}
