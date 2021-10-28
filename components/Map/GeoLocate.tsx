import React from 'react'
import { css } from '@emotion/css'
import { _useMapControl as useMapControl } from 'react-map-gl'

import { FaLocationArrow } from 'components/FA'

type GeoLocateProps = {
    onDetectLocation?(latitude: number, longitude: number): Promise<void> | void
}
const GeoLocate = ({ onDetectLocation }: GeoLocateProps) => {
    const { context, containerRef } = useMapControl({
        onClick: (evt: any) => {
            if (evt.type === 'click') {
                if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        ({ coords }) => {
                            onDetectLocation?.(coords.latitude, coords.longitude)
                        },
                        () => {},
                        {
                            enableHighAccuracy: true,
                        }
                    )
                } else {
                    /* geolocation IS NOT available */
                }
            }
        },
        onDoubleClick: (evt: any) => {
            evt.stopPropagation()
        },
    })

    return (
        <div
            ref={containerRef}
            className={css({
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 4,
                bottom: 20,
                cursor: 'pointer',
                display: 'flex',
                height: 30,
                justifyContent: 'center',
                margin: 10,
                position: 'absolute',
                right: 0,
                width: 30,
            })}>
            <FaLocationArrow />
        </div>
    )
}

export default GeoLocate
