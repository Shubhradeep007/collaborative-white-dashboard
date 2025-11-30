"use client";
import { FormEventHandler, useEffect, useState } from "react";
import { useRenameModel } from "@/store/use-rename-modal";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";

const RenameModal = () => {

    const { mutate, pending } = useApiMutation(api.board.update)

    const { initialValues, isOpen, onClose } = useRenameModel();

    const [title, setTitle] = useState(initialValues.title);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTitle(initialValues.title);

    }, [initialValues.title]);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        mutate({
            id: initialValues.id,
            title
        })
            .then(() => {
                toast.success("Board renamed")
                onClose()
            })
            .catch(() => {
                toast.error("Failed to rename board")
            })
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Board Title</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Enter a new title new title for this board
                    </DialogDescription>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <Input
                            disabled={pending}
                            required
                            maxLength={60}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Board title"
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                disabled={pending}

                                type="submit" >Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RenameModal;
