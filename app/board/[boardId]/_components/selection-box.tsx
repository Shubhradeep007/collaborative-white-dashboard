'use client'

import { useSelectionBounce } from "@/hooks/use-selection-bounce";
import { LayerType, Side, XYWH } from "@/types/canvas"
import { useSelf, useStorage } from "@liveblocks/react";
import { memo } from "react"


interface SelectionBoxProps {
    onResizeHandelPointerDown: (corner: Side, intialBounce: XYWH) => void
}

const HANDEL_WIDTH = 8;

export const SelectionBox = memo(({ onResizeHandelPointerDown }: SelectionBoxProps) => {
    const soleLayerId = useSelf((me) => me.presence.selection.length === 1 ? me.presence.selection[0] : null)

    const isShowingHandels = useStorage((root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    )

    const bounds = useSelectionBounce()

    if (!bounds) return null;

    return (
        <>
            <rect
                className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
                style={{
                    transform: `translate(${bounds.x}px, ${bounds.y}px)`,
                }}
                x={0}
                y={0}
                width={bounds.width}
                height={bounds.height}
            />

            {isShowingHandels && (
                <>
                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "nwse-resize",
                            width: `${HANDEL_WIDTH}px`,
                            height: `${HANDEL_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDEL_WIDTH / 2}px, ${bounds.y - HANDEL_WIDTH / 2}px )`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation()
                            onResizeHandelPointerDown(Side.Top + Side.Left, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "ns-resize",
                            width: `${HANDEL_WIDTH}px`,
                            height: `${HANDEL_WIDTH}px`,
                            transform: `translate(${bounds.x + bounds.width / 2 - HANDEL_WIDTH / 2}px, ${bounds.y - HANDEL_WIDTH / 2}px )`,
                        }}

                         onPointerDown={(e) => {
                            e.stopPropagation()
                            onResizeHandelPointerDown(Side.Top, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "nesw-resize",
                            width: `${HANDEL_WIDTH}px`,
                            height: `${HANDEL_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDEL_WIDTH / 2 + bounds.width}px, 
            ${bounds.y - HANDEL_WIDTH / 2}px)`,
                        }}
                        onPointerDown={(e) => {
                            e.stopPropagation()
                            onResizeHandelPointerDown(Side.Top + Side.Right, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "ew-resize",
                            width: `${HANDEL_WIDTH}px`,
                            height: `${HANDEL_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDEL_WIDTH / 2 + bounds.width}px, 
            ${bounds.y + bounds.height / 2 - HANDEL_WIDTH / 2}px)`,
                        }}
                         onPointerDown={(e) => {
                            e.stopPropagation()
                            onResizeHandelPointerDown(Side.Right, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "nwse-resize",
                            width: `${HANDEL_WIDTH}px`,
                            height: `${HANDEL_WIDTH}px`,
                            transform: `translate(${bounds.x - HANDEL_WIDTH / 2 + bounds.width}px, ${bounds.y - HANDEL_WIDTH / 2 + bounds.height}px)`,
                        }}
                         onPointerDown={(e) => {
                            e.stopPropagation()
                            onResizeHandelPointerDown(Side.Bottom + Side.Right, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "ns-resize",
                            width: `${HANDEL_WIDTH}px`,
                            height: `${HANDEL_WIDTH}px`,
                            transform: `translate(
            ${bounds.x + bounds.width / 2 - HANDEL_WIDTH / 2}px,
            ${bounds.y - HANDEL_WIDTH / 2 + bounds.height}px
            )`,
                        }}
                       onPointerDown={(e) => {
                            e.stopPropagation()
                            onResizeHandelPointerDown(Side.Bottom, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "nesw-resize",
                            width: `${HANDEL_WIDTH}px`,
                            height: `${HANDEL_WIDTH}px`,
                            transform: `translate(
         ${bounds.x - HANDEL_WIDTH / 2}px,
         ${bounds.y - HANDEL_WIDTH / 2 + bounds.height}px
            )`,
                        }}
                         onPointerDown={(e) => {
                            e.stopPropagation()
                            onResizeHandelPointerDown(Side.Bottom + Side.Left, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-1 stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: "ew-resize",
                            width: `${HANDEL_WIDTH}px`,
                            height: `${HANDEL_WIDTH}px`,
                            transform: `translate(
         ${bounds.x - HANDEL_WIDTH / 2}px,
         ${bounds.y - HANDEL_WIDTH / 2 + bounds.height / 2}px
            )`,
                        }}
                       onPointerDown={(e) => {
                            e.stopPropagation()
                            onResizeHandelPointerDown(Side.Left, bounds)
                        }}
                    />


                </>
            )}
        </>
    )
})

SelectionBox.displayName = "SelectionBox"
