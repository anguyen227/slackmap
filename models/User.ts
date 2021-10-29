import { System } from './System'

export interface User extends System {
    teamId: string
    userId: string
}
