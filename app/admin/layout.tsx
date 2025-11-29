"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LayoutDashboard, Users, Settings, Building2, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAdmin = useQuery(api.users.checkIsAdmin);
    const router = useRouter();
    const pathname = usePathname();

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
            </div>
            <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
                {children}
            </main>
        </div>
    );
}
