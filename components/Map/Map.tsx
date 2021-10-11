import { css } from '@emotion/css'
import { useState } from 'react'
import ReactMapGL from 'react-map-gl'

const Map = () => {
    const [viewport, setViewport] = useState({
        longitude: -104.84161,
        latitude: 59.188565,
        zoom: 3,
    })

    return (
        <div
            className={css({
                width: '100%',
                height: '100vh',
            })}>
            <ReactMapGL
                mapStyle='mapbox://styles/noneall/ckulfpoi37zjx18p9g01rpzal'
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
                className='mapbox'
                {...viewport}
                height='100%'
                width='100%'
                onViewportChange={setViewport}
            />
        </div>
    )
}

export default Map
