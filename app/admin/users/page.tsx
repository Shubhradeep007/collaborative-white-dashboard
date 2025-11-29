"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Ban, RefreshCcw, CheckCircle, Pencil } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import ConfirmModal from "@/components/confirm-modal";

export default function UsersPage() {
    const users = useQuery(api.admin.getUsers);
    const banUser = useAction(api.adminActions.banUser);
    const unbanUser = useAction(api.adminActions.unbanUser);
    const deleteUser = useMutation(api.admin.deleteUser);
    const syncUsers = useAction(api.userActions.syncUsers);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const result = await syncUsers();
            toast.success(`Synced ${result.count} users`);
        } catch (error) {
            toast.error("Failed to sync users");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleBan = async (userId: any) => {
        try {
            await banUser({ userId });
            toast.success("User banned");
        } catch (error) {
            toast.error("Failed to ban user");
        }
    };

    const handleUnban = async (userId: any) => {
        try {
            await unbanUser({ userId });
            toast.success("User unbanned");
        } catch (error) {
            toast.error("Failed to unban user");
        }
    };

    const handleDelete = async (userId: any) => {
        try {
            await deleteUser({ userId });
            toast.success("User deleted");
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const [editingUser, setEditingUser] = useState<any>(null);
    const updateUser = useMutation(api.admin.updateUser);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            await updateUser({
                userId: editingUser._id,
                name: editingUser.name,
                role: editingUser.role,
            });
            toast.success("User updated");
            setEditingUser(null);
        } catch (error) {
            toast.error("Failed to update user");
        }
    };

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const deleteUsers = useMutation(api.admin.deleteUsers);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(users?.map((u) => u._id) || []);
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

    const handleBulkDelete = async () => {
        try {
            await deleteUsers({ userIds: selectedIds as any });
            toast.success("Users deleted");
            setSelectedIds([]);
        } catch (error) {
            toast.error("Failed to delete users");
        }
    };

    if (!users) {
        return <div>Loading users...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <ConfirmModal
                            header="Delete Selected Users?"
                            description={`This will permanently delete ${selectedIds.length} users and all their data.`}
                            onConfirm={handleBulkDelete}
                        >
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected ({selectedIds.length})
                            </Button>
                        </ConfirmModal>
                    )}
                    <Button onClick={handleSync} disabled={isSyncing}>
                        <RefreshCcw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        Sync Users
                    </Button>
                </div>
            </div>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <input
                                    type="checkbox"
                                    checked={users.length > 0 && selectedIds.length === users.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                            </TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Clerk ID</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(user._id)}
                                        onChange={(e) => handleSelect(user._id, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                </TableCell>
                                <TableCell className="flex items-center gap-x-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.imageUrl} />
                                        <AvatarFallback>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.name}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.plan === "Pro"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}>
                                        {user.plan}
                                    </span>
                                </TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    {user.clerkId}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingUser(user)}
                                        title="Edit User"
                                    >
                                        <Pencil className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    {user.role === "banned" ? (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleUnban(user._id)}
                                            title="Unban User"
                                        >
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleBan(user._id)}
                                            title="Ban User"
                                        >
                                            <Ban className="h-4 w-4 text-orange-500" />
                                        </Button>
                                    )}
                                    <ConfirmModal
                                        header="Delete User?"
                                        description="This will permanently delete the user and all their data. This action cannot be undone."
                                        onConfirm={() => handleDelete(user._id)}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Delete User"
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

            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editingUser?.name || ""}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={editingUser?.role || "user"}
                                onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="banned">Banned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
