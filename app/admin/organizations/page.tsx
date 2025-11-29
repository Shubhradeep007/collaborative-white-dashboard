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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, RefreshCcw } from "lucide-react";
import ConfirmModal from "@/components/confirm-modal";
import { useState } from "react";
import { syncOrganizations, deleteOrganizationAction, deleteOrganizationsAction } from "../actions";

export default function OrganizationsPage() {
    const organizations = useQuery(api.admin.getOrganizations);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    if (organizations === undefined) {
        return <div>Loading...</div>;
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(organizations.map((org) => org.orgId));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        }
    };

    const handleDelete = async (id: string) => {
        const promise = deleteOrganizationAction(id);
        toast.promise(promise, {
            loading: "Deleting organization...",
            success: "Organization deleted",
            error: "Failed to delete organization",
        });
    };

    const handleBulkDelete = async () => {
        const promise = deleteOrganizationsAction(selectedIds);
        toast.promise(promise, {
            loading: "Deleting organizations...",
            success: "Organizations deleted",
            error: "Failed to delete organizations",
        });
        setSelectedIds([]);
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const result = await syncOrganizations();
            toast.success(`Synced ${result.count} organizations`);
        } catch (error) {
            toast.error("Failed to sync organizations");
            console.error(error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleSync}
                        disabled={isSyncing}
                    >
                        <RefreshCcw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        Sync
                    </Button>
                    {selectedIds.length > 0 && (
                        <ConfirmModal
                            header="Delete Organizations?"
                            description="This will permanently delete the selected organizations and all their boards. This action cannot be undone."
                            onConfirm={handleBulkDelete}
                        >
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete ({selectedIds.length})
                            </Button>
                        </ConfirmModal>
                    )}
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <input
                                    type="checkbox"
                                    checked={organizations.length > 0 && selectedIds.length === organizations.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                            </TableHead>
                            <TableHead>Organization</TableHead>
                            <TableHead>Organization ID</TableHead>
                            <TableHead>Board Count</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {organizations.map((org) => (
                            <TableRow key={org.orgId}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(org.orgId)}
                                        onChange={(e) => handleSelect(org.orgId, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                </TableCell>
                                <TableCell className="flex items-center gap-x-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={org.imageUrl} />
                                        <AvatarFallback>
                                            {org.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {org.name}
                                </TableCell>
                                <TableCell className="font-mono text-xs">{org.orgId}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{org.boardCount}</Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {new Date(org.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <ConfirmModal
                                        header="Delete Organization?"
                                        description="This will permanently delete the organization and all its boards. This action cannot be undone."
                                        onConfirm={() => handleDelete(org.orgId)}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Delete Organization"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
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
