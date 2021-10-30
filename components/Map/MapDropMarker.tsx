import { FlyToInterpolator, InteractiveMapProps } from 'react-map-gl'
import dynamic from 'next/dynamic'
import React, { useCallback, useState } from 'react'
import useSwr from 'swr'

import AutoSizer from 'components/AutoSizer'
import GeoLocate from './GeoLocate'
import LoadingScreen from 'components/Loading/LoadingScreen'
import Pin from './Pin'

import { UserApp } from 'DTO/App/User'
import useAuth from 'services/auth/useAuth'

const Map = dynamic(() => import('components/Map'), {
    loading: () => <LoadingScreen />,
    ssr: false,
})
const LocationPanel = dynamic(() => import('./LocationPanel'), {
    loading: () => null,
    ssr: false,
})

const fetcher = async (...args: [RequestInfo, RequestInit]) => {
    try {
        const res = await fetch(...args)
        const data = await res.json()
        return data?.features?.[0]
    } catch (er) {
        return Promise.reject(er)
    }
}

type MapDropMarkerProps = {
    onComplete?(): void
}
const MapDropMarker = ({ onComplete }: MapDropMarkerProps) => {
    const { updateUser } = useAuth()
    const [viewport, setViewport] = useState<InteractiveMapProps>({
        longitude: -104.84161,
        latitude: 59.188565,
        zoom: 3,
    })
    const [place, setPlace] = useState<any>(null)
    const [reverseGeocode, setReverseGeo] = useState(false)
    const [pin, setPin] = useState<any>(null)
    const url =
        pin && reverseGeocode
            ? `https://api.mapbox.com/geocoding/v5/mapbox.places/${pin?.data?.longitude},${pin?.data?.latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}&limit=1`
            : null

    const {} = useSwr(url, fetcher, {
        onSuccess: (data) => {
            setPlace(data)
            setReverseGeo(false)
        },
    })

    const onMarkerDragEnd = useCallback((event) => {
        setPin({
            data: {
                longitude: event.lngLat[0],
                latitude: event.lngLat[1],
            },
        })
        setReverseGeo(true)
    }, [])

    const handleViewPortChange = useCallback((viewport: InteractiveMapProps) => {
        setViewport((prev) => ({
            ...prev,
            ...viewport,
        }))
    }, [])

    const handleTransitionEnd = (latitude: number, longitude: number) => () => {
        setPin({
            data: {
                latitude,
                longitude,
            },
        })
        handleViewPortChange({ onTransitionEnd: undefined })
    }

    const handleGeocoderViewportChange = useCallback((newViewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 }

        return handleViewPortChange({
            ...newViewport,
            ...geocoderDefaultOverrides,
            onTransitionEnd: handleTransitionEnd(newViewport.latitude, newViewport.longitude),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getResult = useCallback((props) => {
        setPlace(props.result)
    }, [])

    const handleSetLocation = async () => {
        try {
            const user = await UserApp.setUp(pin?.data)
            updateUser(user.data)

            onComplete?.()
        } catch {}
    }

    return (
        <AutoSizer>
            {({ width }) => {
                const height = width < 300 ? 300 : width > 800 ? 800 : width
                return (
                    <div style={{ width, height }}>
                        <Map
                            {...viewport}
                            onViewportChange={handleViewPortChange}
                            enableGeoCoder
                            GeoCoderProps={{
                                position: 'top-right',
                                onViewportChange: handleGeocoderViewportChange,
                                countries: 'ca',
                                marker: false,
                                clearOnBlur: true,
                                clearAndBlurOnEsc: true,
                                onResult: getResult,
                            }}>
                            <GeoLocate
                                onDetectLocation={(latitude, longitude) => {
                                    setViewport({
                                        latitude,
                                        longitude,
                                        zoom: 11,
                                        transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
                                        transitionDuration: 'auto',
                                        onTransitionEnd: () => {
                                            handleTransitionEnd(latitude, longitude)()
                                            setReverseGeo(true)
                                        },
                                    })
                                }}
                            />
                            {pin && <Pin {...pin} noScale draggable onDragEnd={onMarkerDragEnd} />}
                            <LocationPanel loading={reverseGeocode} place={place} onSetLocation={handleSetLocation} />
                        </Map>
                    </div>
                )
            }}
        </AutoSizer>
    )
}

export default MapDropMarker
