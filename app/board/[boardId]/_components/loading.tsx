'use client'

import {  Loader } from "lucide-react"

import { Info } from "./info"
import { Priticipants } from "./priticipants"
import { Toolbar } from "./toolbar"


const Loading = () => {
  return (
    <main className="h-full w-full reletive bg-neutral-100 touch-none flex items-center justify-center">
      <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
      <Info.Skeleton />
      <Priticipants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  )
}

export default Loading