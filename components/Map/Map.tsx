import { forwardRef, useImperativeHandle, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import ReactMapGL, {
    FullscreenControl,
    NavigationControl,
    MapContext,
    MapContextProps,
    MapRef,
    InteractiveMapProps,
} from 'react-map-gl'

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
