import { PaletteMode } from '@mui/material'
import { createTheme, duration, easing } from '@mui/material/styles'
import { shape } from '@mui/system'

const palette = {
    text: {
        primary: 'rgba(0,0,0,.87)',
    },
}

const theme = (paletteMode: PaletteMode = 'light') => {
    return createTheme({
        palette: {
            mode: paletteMode,
            ...palette,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    a: {
                        color: palette.text.primary,
                        textDecoration: 'none',
                        transition: easing.easeIn,
                        transitionDuration: `${duration.leavingScreen}ms`,
                        '&:hover': {
                            transitionDuration: `${duration.enteringScreen}ms`,
                        },
                    },
                    'h1, h2, h3, h4, h5, h6': {
                        margin: 0,
                    },
                    // ::-webkit-scrollbar the scrollbar.
                    // ::-webkit-scrollbar-button the buttons on the scrollbar (arrows pointing upwards and downwards).
                    // ::-webkit-scrollbar-thumb the draggable scrolling handle.
                    // ::-webkit-scrollbar-track the track (progress bar) of the scrollbar.
                    // ::-webkit-scrollbar-track-piece the track (progress bar) NOT covered by the handle.
                    // ::-webkit-scrollbar-corner the bottom corner of the scrollbar, where both horizontal and vertical scrollbars meet.
                    // ::-webkit-resizer the draggable resizing handle that appears at the bottom corner of some elements.
                    '*': {
                        '&::-webkit-scrollbar': {
                            width: '6px',
                            height: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#fff',
                            borderRadius: shape.borderRadius,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: shape.borderRadius,
                            '&:hover': {
                                background: '#555',
                            },
                        },
                    },
                },
            },
        },
    })
}

export default theme
