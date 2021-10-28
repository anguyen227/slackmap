import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import ReactMapGL, {
    FullscreenControl,
    NavigationControl,
    MapContext,
    MapContextProps,
    MapRef,
    Marker,
    FlyToInterpolator,
    InteractiveMapProps,
} from 'react-map-gl'
import useSupercluster from 'use-supercluster'
import useSwr from 'swr'

import Pin from './Pin'
import dynamic from 'next/dynamic'

const fullscreenControlStyle = {
    top: 0,
    left: 0,
    padding: '10px',
}

const navStyle = {
    top: 36,
    left: 0,
    padding: '10px',
}

// const geoData = {
//     convert: (data: { properties: any }) => ({
//         ...data,
//         properties: { cluster: false, ...data.properties },
//     }),
// }

// const fetcher = async (...args: [RequestInfo, RequestInit]) => {
//     try {
//         const res = await fetch(...args)
//         const data = await res.json()

//         return data?.features?.map?.(geoData.convert) ?? []
//     } catch (er) {
//         return Promise.reject(er)
//     }
// }

const palette = [
    [2000, '#4cc9f0'],
    [1500, '#4895ef'],
    [1000, '#4361ee'],
    [500, '#3f37c9'],
    [300, '#3a0ca3'],
    [150, '#480ca8'],
    [100, '#560bad'],
    [50, '#7209b7'],
    [20, '#b5179e'],
    [0, '#f72585'],
] as const

const Geocoder: React.ComponentType<any> = dynamic(() => import('react-map-gl-geocoder'), {
    loading: () => null,
    ssr: false,
})

export type MapProps = InteractiveMapProps & {
    enableGeoCoder?: boolean
    GeoCoderProps?: any
}
const Map = forwardRef<MapRef, MapProps>(({ children, enableGeoCoder, GeoCoderProps, ...props }, ref) => {
    const mapRef = useRef<MapRef>(null)

    useImperativeHandle(ref, () => mapRef.current as MapRef)

    return (
        <MapContext.Provider value={{} as MapContextProps}>
            <ReactMapGL
                mapStyle='mapbox://styles/noneall/ckulfpoi37zjx18p9g01rpzal'
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
                className='mapbox'
                {...props}
                height='100%'
                width='100%'
                ref={mapRef}>
                {children}
                <FullscreenControl style={fullscreenControlStyle} />
                <NavigationControl style={navStyle} />
                {enableGeoCoder && (
                    <Geocoder
                        mapRef={mapRef}
                        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
                        {...GeoCoderProps}
                    />
                )}
            </ReactMapGL>
        </MapContext.Provider>
    )
})

Map.displayName = 'Map'

export default Map
