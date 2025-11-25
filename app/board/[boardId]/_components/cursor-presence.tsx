'use client'

import { useOthersConnectionIds } from '@liveblocks/react/suspense'
import { memo } from 'react'
import { Cursor } from './cursor'

const Cursors = () => {
    const ids = useOthersConnectionIds()

    return (
        <>
            {ids.map((conectionId) => (
                <Cursor
                key={conectionId}
                connectionId={conectionId}
                />
            ))}
        </>
    )
}

export const CursorPresence = memo(() => {
  return (
    <>
        {/* todo: Draft pencil  */}
            <Cursors /> 
        
    </>
  )
})

CursorPresence.displayName = "CursorPresence"

