import { DocumentReference, getDoc } from 'firebase/firestore'
import { useCallback } from 'react'
import { useSafeState } from 'react-hooks'

import { System } from 'models/System'
import SystemError from 'models/SystemError'

import parseError from 'utils/parseError'
import { ErrorCode } from 'enum/ErrorCode'

interface State<D> {
    data?: D
    loading: boolean
    error?: any
}
export default function useDocument<D extends System = Record<string, unknown>>(docRef: DocumentReference<D>) {
    const [state, setState] = useSafeState<State<D>>({
        loading: false,
    })

    const fetchDoc = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true }))
        try {
            const doc = await getDoc(docRef)
            if (doc.exists()) {
                setState((prev) => ({
                    data: doc.data(),
                    loading: false,
                    error: undefined,
                }))
            } else {
                throw new SystemError(ErrorCode.DataNotFound)
            }
        } catch (err) {
            setState((prev) => ({
                loading: false,
                error: parseError(err),
                data: undefined,
            }))
        }
    }, [docRef])

    return {
        ...state,
        fetchDoc,
    }
}
