import { css } from '@emotion/css'
import { useRef, useState } from 'react'
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

const geoData = {
    convert: (data: { properties: any }) => ({
        ...data,
        properties: { cluster: false, ...data.properties },
    }),
}

const fetcher = async (...args: [RequestInfo, RequestInit]) => {
    try {
        const res = await fetch(...args)
        const data = await res.json()

        return data?.features?.map?.(geoData.convert) ?? []
    } catch (er) {
        return Promise.reject(er)
    }
}

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

const Map = () => {
    const mapRef = useRef<MapRef>(null)
    const [viewport, setViewport] = useState<InteractiveMapProps>({
        longitude: -104.84161,
        latitude: 59.188565,
        zoom: 3,
    })

    // load and prepare data
    const url = 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
    const { data, error } = useSwr(url, fetcher)

    // get map bounds
    const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null

    // get clusters
    const { clusters, supercluster } = useSupercluster({
        points: !error && data ? data : [],
        bounds,
        zoom: viewport.zoom as number,
        options: { radius: 60, maxZoom: 12 },
    })

    return (
        <div
            className={css({
                width: '100%',
                height: '100vh',
            })}>
            <MapContext.Provider value={{} as MapContextProps}>
                <ReactMapGL
                    mapStyle='mapbox://styles/noneall/ckulfpoi37zjx18p9g01rpzal'
                    mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
                    className='mapbox'
                    {...viewport}
                    height='100%'
                    width='100%'
                    onViewportChange={setViewport}
                    ref={mapRef}>
                    {clusters.map((cluster) => {
                        // every cluster point has coordinates
                        const [longitude, latitude] = cluster.geometry.coordinates
                        // the point may be either a cluster or a crime point
                        const {
                            cluster: isCluster,
                            point_count: pointCount,
                            point_count_abbreviated: pointAbbr,
                        } = cluster.properties

                        if (isCluster) {
                            const backgroundColor =
                                palette.filter(([range]) => range <= pointCount)?.[0]?.[1] ?? '#1978c8'
                            return (
                                <Marker key={`cluster-${cluster.id}`} latitude={latitude} longitude={longitude}>
                                    <div
                                        className={css({
                                            alignItems: 'center',
                                            borderRadius: '50%',
                                            color: '#fff',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            lineHeight: 1,
                                        })}
                                        style={{
                                            backgroundColor,
                                            width: 30 + Math.round((pointCount / data.length) * 1000) / 8,
                                            height: 30 + Math.round((pointCount / data.length) * 1000) / 8,
                                        }}
                                        onClick={() => {
                                            const expansionZoom = Math.min(
                                                supercluster.getClusterExpansionZoom(cluster.id),
                                                20
                                            )

                                            setViewport((prev) => ({
                                                ...prev,
                                                latitude,
                                                longitude,
                                                zoom: expansionZoom,
                                                transitionInterpolator: new FlyToInterpolator({
                                                    speed: 2,
                                                }),
                                                transitionDuration: 'auto',
                                            }))
                                        }}>
                                        {pointCount > 999 ? pointAbbr : pointCount}
                                    </div>
                                </Marker>
                            )
                        }
                        return (
                            <Pin
                                key={`user-${cluster.properties.id}`}
                                data={{
                                    ...cluster.properties,
                                    latitude,
                                    longitude,
                                }}
                            />
                        )
                    })}
                    <FullscreenControl style={fullscreenControlStyle} />
                    <NavigationControl style={navStyle} />
                </ReactMapGL>
            </MapContext.Provider>
        </div>
    )
}

export default Map
