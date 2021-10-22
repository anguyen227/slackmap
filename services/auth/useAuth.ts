import { useContext } from 'react'
import { AuthContext } from 'services/auth/AuthProvider'

export default function useAuth() {
    return useContext(AuthContext)
}
