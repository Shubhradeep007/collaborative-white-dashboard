"use client"

// import { useSelf } from "@liveblocks/react";
import {Info} from "./info"
import {Priticipants} from "./priticipants"
import {Toolbar} from "./toolbar"


interface CanvasProps{
  boardId: string
}

const Canvas = ({boardId}: CanvasProps) => {
  //  const info = useSelf((me) => me.info);

  //  console.log({info});
   
  return (
    <>
      <main className="h-full w-full reletive bg-neutral-100 touch-none">
        <Info boardId={boardId}/>
        <Priticipants />
        <Toolbar />
      </main>
    </>
  )
}

export default Canvas