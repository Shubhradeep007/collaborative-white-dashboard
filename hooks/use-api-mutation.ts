

import { useMutation } from 'convex/react'
import { useState } from 'react'

import { FunctionReference } from "convex/server";

export const useApiMutation = (mutationFunction: FunctionReference<"mutation">) => {

    const [pending, setPending] = useState(false)
    const apiMutation = useMutation(mutationFunction)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mutate = (payload: any) => {
        setPending(true)
        return apiMutation(payload)
            .finally(() => setPending(false))
            .then((result) => {
                return result
            })
            .catch((error) => {
                throw error
            })
    }

    return {
        mutate, pending
    }


}
