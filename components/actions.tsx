"use client";

import {
    DropdownMenuContentProps,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import ConfimModal from "./confirm-modal";
import { Button } from "./ui/button";
import { useRenameModel } from "@/store/use-rename-modal";

interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
}

const Actions = ({ children, side, sideOffset, id, title }: ActionsProps) => {

    const { onOpen } = useRenameModel()
    const { mutate, pending } = useApiMutation(api.board.remove)

    const onCopyLink = () => {
        navigator.clipboard.writeText
            (
                `${window.location.origin}/board/${id}`

            )
            .then(() => toast.success("Link Copied"))
            .catch(() => toast.error("Failed to copy link"))

    }

    const onDelete = () => {
        mutate({ id })
            .then(() => toast.success("Board Delete"))
            .catch(() => toast.error("Failed to delete the board"))
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
                <DropdownMenuContent
                    onClick={(e) => e.stopPropagation()}
                    side={side}
                    sideOffset={sideOffset}
                    className="w-60 "
                >

                    <DropdownMenuItem
                        onClick={onCopyLink}
                        className="p-3 cursor-pointer"
                    >
                        <Link2 className="h-4 w-4 mr-2" />
                        Copy board link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onOpen(id, title)}
                        className="p-3 cursor-pointer"
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Rename
                    </DropdownMenuItem>

                    <ConfimModal
                        header="Delete Board?"
                        description="This will delete the board and all of its content."
                        disabled={pending}
                        onConfirm={onDelete}
                    >
                        <Button
                        variant="ghost"
                        className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </ConfimModal>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default Actions;
