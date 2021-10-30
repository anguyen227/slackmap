import { _useMapControl as useMapControl } from 'react-map-gl'
import { Button, Fade, Paper, Typography } from '@mui/material'
import { css } from '@emotion/css'
import React from 'react'

import LoadingScreen from 'components/Loading/LoadingScreen'

type LocationPanelProps = {
    loading?: boolean
    place?: any
    onSetLocation?(): void
}
const LocationPanel = ({ loading, place, onSetLocation }: LocationPanelProps) => {
    const { context, containerRef } = useMapControl({
        onClick: (evt: any) => {
            if (evt.type === 'click') {
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
                bottom: 0,
                margin: 36,
                minHeight: 100,
                position: 'absolute',
                width: '36%',
            })}>
            <Fade in={!!place}>
                <Paper sx={{ p: 3, width: '100%' }}>
                    <Typography sx={{ mb: 2 }} variant='h6'>
                        {place?.place_name ?? 'Select your location'}
                    </Typography>
                    <Button onClick={onSetLocation} variant='contained'>
                        Set as location
                    </Button>
                    {loading && <LoadingScreen mode='absolute' backdrop />}
                </Paper>
            </Fade>
        </div>
    )
}

export default LocationPanel
