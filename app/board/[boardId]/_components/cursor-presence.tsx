'use client'

import { useOthersConnectionIds } from '@liveblocks/react/suspense'
import { memo } from 'react'
import { Cursor } from './cursor'
import { shallow, useOthersMapped } from '@liveblocks/react'
import { Path } from './path'
import { colorToCss } from '@/lib/utils'

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

const Drafts = () => {
    const others = useOthersMapped((other) => ({
        pencilDraft: other.presence.pencilDraft,
        penColor: other.presence.penColor,
    }), shallow)

    return (
        <>
            {others.map(([Key, other]) => {
                if (other.pencilDraft && other.pencilDraft.length > 0) {
                    return (
                        <Path
                            key={Key}
                            x={0}
                            y={0}
                            points={other.pencilDraft}
                            fill={other.penColor ? colorToCss(other.penColor) : "#000"}
                        />
                    )
                }
                return null
            })}
        </>
    )
}

export const CursorPresence = memo(() => {
    return (
        <>
            <Drafts />
            <Cursors />

        </>
    )
})

CursorPresence.displayName = "CursorPresence"

