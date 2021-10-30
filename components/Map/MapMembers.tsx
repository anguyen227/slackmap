import { FlyToInterpolator, InteractiveMapProps, MapRef, Marker } from 'react-map-gl'
import React, { useRef, useState } from 'react'
import useSupercluster from 'use-supercluster'

import { Member } from 'models/Member'
import Map from './Map'
import Pin from './Pin'
import { GeoData } from 'DTO/App/Member'
import { css } from '@emotion/css'

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

export type MapMembersProps = {
    data: GeoData<Member>[]
}
const MapMembers = ({ data }: MapMembersProps) => {
    const mapRef = useRef<MapRef>(null)

    const [viewport, setViewport] = useState<InteractiveMapProps>({
        longitude: -104.84161,
        latitude: 59.188565,
        zoom: 3,
    })

    // get map bounds
    const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null

    // get clusters
    const { clusters, supercluster } = useSupercluster({
        points: data ?? [],
        bounds,
        zoom: viewport.zoom as number,
        options: { radius: 60, maxZoom: 12 },
    })

    return (
        <Map ref={mapRef} {...viewport} onViewportChange={setViewport}>
            {clusters.map((cluster) => {
                // every cluster point has coordinates
                const [lng, lat] = cluster.geometry.coordinates
                // the point may be either a cluster or a crime point
                const {
                    cluster: isCluster,
                    point_count: pointCount,
                    point_count_abbreviated: pointAbbr,
                } = cluster.properties

                if (isCluster) {
                    const backgroundColor = palette.filter(([range]) => range <= pointCount)?.[0]?.[1] ?? '#1978c8'
                    return (
                        <Marker key={`cluster-${cluster.id}`} latitude={lat} longitude={lng}>
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
                                    width: 30 + Math.round((pointCount / data?.length) * 1000) / 8,
                                    height: 30 + Math.round((pointCount / data?.length) * 1000) / 8,
                                }}
                                onClick={() => {
                                    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20)

                                    setViewport((prev) => ({
                                        ...prev,
                                        latitude: lat,
                                        longitude: lng,
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
                            lng,
                            lat,
                        }}
                    />
                )
            })}
        </Map>
    )
}

export default MapMembers
