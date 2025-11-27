'use client'

import Image from "next/image"
import Link from "next/link"
import Overlay from "./overlay"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@clerk/nextjs"
import Footer from "./footer"
import { Skeleton } from "@/components/ui/skeleton"
import Actions from "@/components/actions"
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

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

    const {
        mutate: onFavorite,
        pending: pendingFavorite
    } = useApiMutation(api.board.Favorite)


    const {
        mutate: onUnFavorite,
        pending: pendingUnFavorite
    } = useApiMutation(api.board.UnFavorite)


    const toggleFavroite = () => {
        if (isFavriotes) {
            onUnFavorite({ id })
                .catch(() => {
                    toast.error("Failed to unfavorite")
                })
        } else {
            onFavorite({ id, orgId })
                .catch(() => {
                    toast.error("Failed to favorite")
                })
        }
    }

    const authorLable = userId === authorId ? "You" : authorName
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true
    })

    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image
                        fill
                        src={imageUrl}
                        alt={title}
                        className="object-cover"
                    />
                    <Overlay />
                    <Actions
                        id={id}
                        title={title}
                        side="right">
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none cursor-pointer">
                            <MoreHorizontal
                                className="text-white opacity-75 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </Actions>
                </div>
                <Footer
                    isFavriotes={isFavriotes}
                    title={title}
                    authorLable={authorLable}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavroite}
                    disabled={pendingFavorite || pendingUnFavorite}
                />
            </div>
        </Link>

    )


}


BoardCard.Skeleton = function boardCardSkeleton() {
    return (
        <div className="bg-black rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
        </div>

    )
}


