import { System } from './System'
import { Location } from './Location'

export interface Member extends System, Location {
    avatar_url?: string
    display_name?: string
    uid?: string
    is_admin?: boolean
}
