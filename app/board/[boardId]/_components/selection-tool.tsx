'use client'

import { Button } from "@/components/ui/button"
import { Hint } from "@/components/Hint"
import { BringToFront, SendToBack, Trash2 } from "lucide-react"
import { useSelectionBounce } from "@/hooks/use-selection-bounce"
import { Camera, Color } from "@/types/canvas"
import { useMutation, useSelf } from "@liveblocks/react"
import { memo } from "react"
import { ColorPicker } from "./color-picker"
import { useDeleteLayers } from "@/hooks/use-delete-layers"

interface SelectionToolProps {
    camera: Camera
    setLastUseColor: (color: Color) => void
}

export const SelectionTool = memo(({ camera, setLastUseColor }: SelectionToolProps) => {

    const selection = useSelf((me) => me.presence.selection)

    const moveToBack = useMutation((
        { storage },
    ) => {
        const liveLayerIds = storage.get("layerIds")
        const indices: number[] = []

        const arr = liveLayerIds?.toArray()

        for (let i = 0; i < arr?.length; i++) {
            if (selection?.includes(arr[i])) {
                indices.push(i)
            }
        }

        for (let i = 0; i < indices.length; i++) {
            liveLayerIds.move(indices[i], i)

        }

    }, [selection])


    const moveToFront = useMutation((
        { storage },
    ) => {
        const liveLayerIds = storage.get("layerIds")
        const indices: number[] = []

        const arr = liveLayerIds?.toArray()

        for (let i = 0; i < arr?.length; i++) {
            if (selection?.includes(arr[i])) {
                indices.push(i)
            }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
            liveLayerIds.move(indices[i], arr?.length - 1 - (indices.length - 1 - i))

        }

    }, [selection])




    const setFill = useMutation((
        { storage },
        fill: Color
    ) => {
        const livelayer = storage.get("layers")
        setLastUseColor(fill)

        selection?.forEach((id) => {
            livelayer?.get(id)?.set("fill", fill)
        })
    }, [selection, setLastUseColor])

    const deleteLayers = useDeleteLayers()

    const selectionBounce = useSelectionBounce()

    if (!selection || !selectionBounce) return null

    const x = selectionBounce.width / 2 + selectionBounce.x + camera.x
    const y = selectionBounce.y + camera.y

    return (
        <div
            className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
            style={{
                transform: `translate(
                calc(${x}px - 50%),
                calc(${y - 16}px - 100%)
            )`,
            }}
        >

            <ColorPicker
                onChange={setFill}
            />

            <div className="flex flex-col gap-y-0.5">
                <Hint lebel="Bring to front">
                    <Button
                        variant="board"
                        size="icon"
                        onClick={moveToFront}
                    >
                        <BringToFront />
                    </Button>
                </Hint>

                <Hint lebel="Send to back" side="bottom">
                    <Button
                        variant="board"
                        size="icon"
                        onClick={moveToBack}
                    >
                        <SendToBack />
                    </Button>
                </Hint>
            </div>

            <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
                <Hint lebel="Delete">
                    <Button variant="board" onClick={deleteLayers}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </Hint>
            </div>

        </div>
    )
})

SelectionTool.displayName = "SelectionTool"


