import axios from 'api/axios'
import MapDropMarker from 'components/Map/MapDropMarker'
import React from 'react'

const LoginPage = () => {
    return (
        <>
            <MapDropMarker />
        </>
    )
}

export default LoginPage

export const getStaticProps = async () => {
    return {
        props: {
            publicPage: true,
        },
    }
}
