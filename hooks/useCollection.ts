import { CollectionReference, getDocs, QuerySnapshot } from 'firebase/firestore'
import { useSafeState } from 'react-hooks'

import SystemError from 'models/SystemError'

import parseError from 'utils/parseError'
import { ErrorCode } from 'enum/ErrorCode'

interface State<D> {
    data?: D[]
    loading: boolean
    error?: any
}
export default function useCollection<D = Record<string, unknown>>(
    colRef?: CollectionReference<D> | null,
    defaultState?: Partial<State<D>>
) {
    const [state, setState] = useSafeState<State<D>>({
        loading: false,
        ...defaultState,
    })

    const _iterateQuery = async (snapshot: QuerySnapshot<D>): Promise<D[]> => {
        return new Promise((resolve) => {
            let data: D[] = []
            snapshot.forEach((doc) => {
                data.push(doc.data())
            })
            resolve(data)
        })
    }

    const fetchDocs = async () => {
        if (colRef) {
            setState((prev) => ({ ...prev, loading: true }))
            try {
                const snapshot = await getDocs(colRef)
                if (snapshot.empty) {
                    throw new SystemError(ErrorCode.DataNotFound)
                } else {
                    const data = await _iterateQuery(snapshot)
                    setState((prev) => ({
                        data,
                        loading: false,
                        error: undefined,
                    }))
                }
            } catch (err) {
                setState((prev) => ({
                    loading: false,
                    error: parseError(err),
                    data: defaultState?.data,
                }))
            }
        }
    }

    return {
        ...state,
        fetchDocs,
    }
}
