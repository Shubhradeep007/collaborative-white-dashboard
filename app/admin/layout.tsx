"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LayoutDashboard, Users, Settings, Building2, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAdmin = useQuery(api.users.checkIsAdmin);
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useUser();
    const { openUserProfile, signOut } = useClerk();

    useEffect(() => {
        if (isAdmin === false) {
            router.push("/");
        }
    }, [isAdmin, router]);

    if (isAdmin === undefined) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            active: pathname === "/admin",
        },
        {
            label: "Users",
            icon: Users,
            href: "/admin/users",
            active: pathname === "/admin/users",
        },
        {
            label: "Organizations",
            icon: Building2,
            href: "/admin/organizations",
            active: pathname === "/admin/organizations",
        },
        {
            label: "Boards",
            icon: LayoutDashboard,
            href: "/admin/boards",
            active: pathname === "/admin/boards",
        },
        {
            label: "Subscriptions",
            icon: CreditCard,
            href: "/admin/subscriptions",
            active: pathname === "/admin/subscriptions",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/admin/settings",
            active: pathname === "/admin/settings",
        },
    ];

    return (
        <div className="flex h-full">
            <div className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-x-2 px-4 py-3 rounded-lg transition hover:bg-gray-800",
                                route.active && "bg-gray-800 text-blue-400"
                            )}
                        >
                            <route.icon className="h-5 w-5" />
                            {route.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition cursor-pointer group">
                        <div
                            onClick={() => openUserProfile()}
                            className="flex items-center gap-x-3 flex-1"
                        >
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "h-10 w-10"
                                    }
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{user?.fullName || user?.firstName || 'Admin'}</span>
                                <span className="text-xs text-gray-400">View Profile</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                signOut(() => router.push("/"));
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
                {children}
            </main>
        </div>
    );
}
