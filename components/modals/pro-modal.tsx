"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useProModal } from "@/store/use-pro-modal";
import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const ProModal = () => {
    const { isOpen, onClose } = useProModal();
    const [pending, setPending] = useState(false);

    const onSubscribe = async () => {
        try {
            setPending(true);
            const response = await fetch("/api/stripe", {
                method: "POST",
            });

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setPending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[340px] p-0 overflow-hidden">
                <div className="aspect-video relative flex items-center justify-center bg-neutral-950">
                    <Image
                        src="/upgrade.png"
                        alt="Pro"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="text-neutral-700 mx-auto space-y-6 p-6">
                    <h2 className="font-semibold text-xl">
                        Upgrade to Pro Today!
                    </h2>
                    <div className="pl-3">
                        <ul className="text-[11px] space-y-1 list-disc">
                            <li>Unlimited boards</li>
                            <li>Unlimited members</li>
                            <li>Advanced tools</li>
                            <li>Priority support</li>
                        </ul>
                    </div>
                    <Button
                        disabled={pending}
                        onClick={onSubscribe}
                        className="w-full"
                        size="sm"
                    >
                        Upgrade for ₹499/mo
                        <Zap className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
