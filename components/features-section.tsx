"use client";

import { Zap, Users, Shield, Globe, MousePointer2, Layers } from "lucide-react";

const features = [
    {
        name: "Real-time Collaboration",
        description:
            "Work together with your team in real-time. See cursors, edits, and updates instantly as they happen.",
        icon: Users,
    },
    {
        name: "Infinite Canvas",
        description:
            "Never run out of space. Our infinite canvas lets your ideas grow without boundaries or limitations.",
        icon: Globe,
    },
    {
        name: "Smart Tools",
        description:
            "Intelligent drawing tools that perfect your shapes and lines automatically. Focus on ideas, not precision.",
        icon: MousePointer2,
    },
    {
        name: "Layer Management",
        description:
            "Organize complex diagrams with ease using our advanced layer management system. Lock, hide, and reorder.",
        icon: Layers,
    },
    {
        name: "Enterprise Security",
        description:
            "Bank-grade security for your data. Role-based access control, audit logs, and secure data encryption.",
        icon: Shield,
    },
    {
        name: "Lightning Fast",
        description:
            "Built for performance. Handle thousands of elements without lag, ensuring a smooth experience.",
        icon: Zap,
    },
];

export default function FeaturesSection() {
    return (
        <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
                        Everything you need
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Powerful features for modern teams
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Sparky provides all the tools you need to brainstorm, plan, and execute your best ideas together.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
