"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Layout, CreditCard, IndianRupee } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

export default function AdminDashboard() {
    const stats = useQuery(api.admin.getStats);
    const { user } = useUser();

    if (!stats) {
        return (
            <div className="space-y-8 p-8">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-[180px] rounded-3xl" />
                    <Skeleton className="h-[180px] rounded-3xl" />
                    <Skeleton className="h-[180px] rounded-3xl" />
                    <Skeleton className="h-[180px] rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Dashboard
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Welcome back, <span className="font-semibold text-gray-900">{user?.firstName || user?.fullName || 'Admin'}</span>! Here's what's happening today.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                            <div className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
                                {stats.usersCount}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue - Highlighted Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                            <IndianRupee className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                    <div className="text-3xl font-bold text-gray-900 mt-1">
                        ₹{stats.revenue.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Estimated earnings</p>
                </div>

                {/* Active Boards */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                            <Layout className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Active Boards</h3>
                    <div className="text-3xl font-bold text-gray-900 mt-1">
                        {stats.boardsCount}
                    </div>
                </div>

                {/* Active Subscriptions */}
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-green-50 text-green-600">
                            <CreditCard className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">Subscriptions</h3>
                    <div className="text-3xl font-bold text-gray-900 mt-1">
                        {stats.subscriptionsCount}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Active pro plans</p>
                </div>
            </div>
        </div>
    );
}
