import { System } from './System'

export interface Member extends System {
    email: string
    userId: string
    avatarUrl?: string
    displayName?: string
    uid?: string
    geohash?: string
    lat?: number | null
    lng?: number | null
    isAdmin?: boolean
}
