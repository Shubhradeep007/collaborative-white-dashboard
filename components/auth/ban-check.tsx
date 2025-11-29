"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const BanCheck = ({ children }: { children: React.ReactNode }) => {
    const isBanned = useQuery(api.users.checkIsBanned);
    const { signOut } = useClerk();
    const router = useRouter();

    const handleClose = () => {
        signOut(() => router.push("/"));
    };

    // Handle loading state for isBanned
    if (isBanned === undefined) {
        return null; // Or a loading spinner
    }

    if (isBanned) {
        return (
            <Dialog open={true} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ban"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>
                            Account Suspended
                        </DialogTitle>
                        <DialogDescription className="pt-4">
                            Your account has been suspended due to a violation of our Terms of Service.
                            <br /><br />
                            If you believe this is a mistake, please contact support.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleClose} className="w-full">
                            Acknowledge & Sign Out
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return <>{children}</>;
};
