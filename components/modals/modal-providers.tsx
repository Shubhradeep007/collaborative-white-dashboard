'use client'

import { useEffect, useState } from "react"
import RenameModal from "./rename-modal"
import { ProModal } from "./pro-modal";

const ModalProvider = () => {

  const [isMounted, setIsMounted] = useState(false)


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  return (
    <>
      <RenameModal />
      <ProModal />
    </>
  )
}

export default ModalProvider