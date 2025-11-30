"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import { useAction } from "convex/react";
import ConfirmModal from "@/components/confirm-modal";
import { useState } from "react";

export default function SubscriptionsPage() {
    const subscriptions = useQuery(api.admin.getSubscriptions);
    const cancelSubscription = useAction(api.adminActions.cancelSubscription);
    const cancelSubscriptions = useAction(api.adminActions.cancelSubscriptions);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleCancel = async (subscriptionId: string, userId: string) => {
        try {
            await cancelSubscription({ subscriptionId, userId });
            toast.success("Subscription cancelled");
        } catch (error) {
            toast.error("Failed to cancel subscription");
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(subscriptions?.map((s) => s.stripeSubscriptionId) || []);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        }
    };

    const handleBulkCancel = async () => {
        try {
            const subsToCancel = selectedIds.map(id => {
                const sub = subscriptions?.find(s => s.stripeSubscriptionId === id);
                return { subscriptionId: id, userId: sub?.userId || "" };
            });

            await cancelSubscriptions({ subscriptions: subsToCancel });
            toast.success("Subscriptions cancelled");
            setSelectedIds([]);
        } catch (error) {
            toast.error("Failed to cancel subscriptions");
        }
    };

    if (!subscriptions) {
        return <div>Loading subscriptions...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
                {selectedIds.length > 0 && (
                    <ConfirmModal
                        header="Cancel Selected Subscriptions?"
                        description={`This will cancel ${selectedIds.length} subscriptions immediately.`}
                        onConfirm={handleBulkCancel}
                    >
                        <Button variant="destructive" size="sm">
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Selected ({selectedIds.length})
                        </Button>
                    </ConfirmModal>
                )}
            </div>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <input
                                    type="checkbox"
                                    checked={subscriptions.length > 0 && selectedIds.length === subscriptions.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                            </TableHead>
                            <TableHead>User Name</TableHead>
                            <TableHead>Stripe Customer</TableHead>
                            <TableHead>Subscription ID</TableHead>
                            <TableHead>Period End</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.map((sub) => (
                            <TableRow key={sub._id}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(sub.stripeSubscriptionId)}
                                        onChange={(e) => handleSelect(sub.stripeSubscriptionId, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                </TableCell>
                                <TableCell className="font-medium text-sm">{sub.userName}</TableCell>
                                <TableCell className="font-mono text-xs">
                                    {sub.stripeCustomerId}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {sub.stripeSubscriptionId}
                                </TableCell>
                                <TableCell>
                                    {sub.stripeCurrentPeriodEnd
                                        ? format(new Date(sub.stripeCurrentPeriodEnd), "PP p")
                                        : "N/A"}
                                </TableCell>
                                <TableCell>Pro</TableCell>
                                <TableCell className="text-right">
                                    <ConfirmModal
                                        header="Cancel Subscription?"
                                        description="This will cancel the subscription immediately. The user will lose Pro features."
                                        onConfirm={() => handleCancel(sub.stripeSubscriptionId, sub.userId)}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Cancel Subscription"
                                        >
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </ConfirmModal>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
