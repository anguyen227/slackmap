// in your theme file that you call `createTheme()`
import { Theme } from '@mui/material/styles'
import { Mixins } from '@mui/material/styles/createMixins'

declare module '@mui/styles' {
    interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles/createMixins' {
    interface Mixins extends Mixins {
        borderRadient(pos: 'top' | 'center' | 'bottom'): CSSProperties
        borderPseudo(pos: 'top' | 'right' | 'left' | 'bottom'): CSSProperties
    }
}
