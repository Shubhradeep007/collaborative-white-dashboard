"use client"

import { useCallback, useState } from "react";
import { Info } from "./info"
import { Priticipants } from "./priticipants"
import { Toolbar } from "./toolbar"
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import { useHistory, useCanUndo, useCanRedo, useMutation } from "@liveblocks/react";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";



interface CanvasProps {
  boardId: string
}

const Canvas = ({ boardId }: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }))
  }, [])

  const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e.preventDefault()
    const current = pointerEventToCanvasPoint(e, camera)
    setMyPresence({
      cursor: current
    })
  }, [])

  const onPointerLeave = useMutation((
    { setMyPresence }
  ) => {
    setMyPresence({
      cursor: null
    })
  }, [])


  return (
    <>
      <main className="h-full w-full reletive bg-neutral-100 touch-none">
        <Info boardId={boardId} />
        <Priticipants />
        <Toolbar
          canvasState={canvasState}
          setCanvasState={setCanvasState}
          canUndo={canUndo}
          canRedo={canRedo}
          undo={history.undo}
          redo={history.redo}
        />
        <svg
          className="h-[100vh] w-[100vw]"
          onWheel={onWheel}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <g>
            <CursorPresence />
          </g>

        </svg>
      </main>
    </>
  )
}

export default Canvas