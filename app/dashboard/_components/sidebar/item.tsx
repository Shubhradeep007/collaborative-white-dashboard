'use client'

import Image from "next/image"

import {
    useOrganization,
    useOrganizationList
} from "@clerk/nextjs"

import {cn} from "@/lib/utils"

import {Hint} from "@/components/Hint"

interface ItemProps {
    id: string,
    name: string,
    imageUrl: string
}


const Item = ({id, name, imageUrl}: ItemProps) => {

    const {organization} = useOrganization()
    const {setActive} = useOrganizationList()

    const isActive = organization?.id === id

    const onClick = () => {
        if (!setActive) return
        
        setActive({organization : id})
    }

  return (
    <>
        <div className="aspect-square reletive">
            <Hint
            lebel={name}
            side="right"
            align="start"
            sideOffset={18}
            >
            <Image 
            width={100}
            height={100}
            src={imageUrl}
            alt={name}
            onClick={onClick}
            className={cn(
                "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
                isActive && "opacity-100"
            )}
            />
            </Hint>
        </div>
    </>
  )
}

export default Item
