'use client'

import Image from "next/image"
import Link from "next/link"
import Overlay from "./overlay"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@clerk/nextjs"
import Footer from "./footer"
import { Skeleton } from "@/components/ui/skeleton"


interface BoardCardProps {
    id: string,
    title: string,
    authorName: string,
    authorId: string,
    createdAt: number,
    imageUrl: string,
    orgId: string,
    isFavriotes: boolean
}

export const BoardCard = ({
    id,
    title,
    authorName,
    authorId,
    createdAt,
    imageUrl,
    orgId,
    isFavriotes
}: BoardCardProps) => {

    const { userId } = useAuth()
    

    const authorLable = userId === authorId ? "You" : authorName
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true
    })

    return (
        <Link href={`/dashboard/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image
                        fill
                        src={imageUrl}
                        alt={title}
                        className="object-cover"
                    />
                    <Overlay />
                </div>
                <Footer 
                isFavriotes={isFavriotes}
                title={title}
                authorLable={authorLable}
                createdAtLabel={createdAtLabel}
                onClick={() => {}}
                disabled={false}
                />
            </div>
        </Link>

    )
    

}


BoardCard.Skeleton = function boardCardSkeleton() {
    return (
         <div className="aspect-[100/127] rounded-lg overflow-hidden">
                <Skeleton className="w-full h-full" />
        </div>

    )
}


