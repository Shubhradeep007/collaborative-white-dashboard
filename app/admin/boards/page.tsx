"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import ConfirmModal from "@/components/confirm-modal";
import { useState } from "react";

export default function AdminBoardsPage() {
    const boards = useQuery(api.admin.getBoards);
    const deleteBoard = useMutation(api.admin.deleteBoard);

    const handleDelete = async (id: any) => {
        try {
            await deleteBoard({ id });
            toast.success("Board deleted");
        } catch (error) {
            toast.error("Failed to delete board");
        }
    };

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const deleteBoards = useMutation(api.admin.deleteBoards);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(boards?.map((b) => b._id) || []);
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
            await deleteBoards({ ids: selectedIds as any });
            toast.success("Boards deleted");
            setSelectedIds([]);
        } catch (error) {
            toast.error("Failed to delete boards");
        }
    };

    if (!boards) {
        return <div>Loading boards...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Boards</h2>
                {selectedIds.length > 0 && (
                    <ConfirmModal
                        header="Delete Selected Boards?"
                        description={`This will permanently delete ${selectedIds.length} boards.`}
                        onConfirm={handleBulkDelete}
                    >
                        <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Selected ({selectedIds.length})
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
                                    checked={boards.length > 0 && selectedIds.length === boards.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                            </TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Org ID</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {boards.map((board) => (
                            <TableRow key={board._id}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(board._id)}
                                        onChange={(e) => handleSelect(board._id, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {board.title}
                                        <Link href={`/board/${board._id}`} target="_blank">
                                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                        </Link>
                                    </div>
                                </TableCell>
                                <TableCell>{board.authorName}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    {board.orgId}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(board._creationTime), "PPP")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <ConfirmModal
                                        header="Delete Board?"
                                        description="This will permanently delete the board and all its content. This action cannot be undone."
                                        onConfirm={() => handleDelete(board._id)}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Delete Board"
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
