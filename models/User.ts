import { System } from './System'
import { Location } from './Location'

type Team = {
    team_id: string
    user_id: string
}

export interface User extends System, Location {
    teams?: Team[]
    initialized?: boolean
    email: string
    default_team?: [string, string]
}
