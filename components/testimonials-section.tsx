"use client";

import Image from "next/image";

const testimonials = [
    {
        body: "Sparky has completely transformed how our design team collaborates. The infinite canvas is a game-changer.",
        author: {
            name: "Sarah Chen",
            handle: "Product Designer",
            imageUrl:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        body: "The real-time sync is incredibly fast. It feels like we're all in the same room, even when we're miles apart.",
        author: {
            name: "Michael Foster",
            handle: "Engineering Lead",
            imageUrl:
                "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
    {
        body: "Simple, intuitive, and powerful. It's exactly what we needed for our sprint planning sessions.",
        author: {
            name: "Dries Vincent",
            handle: "Scrum Master",
            imageUrl:
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
    },
];

export default function TestimonialsSection() {
    return (
        <div className="bg-gray-50 py-24 sm:py-32 dark:bg-gray-800/50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600 dark:text-blue-400">
                        Testimonials
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Loved by teams everywhere
                    </p>
                </div>
                <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.author.handle} className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10">
                                <blockquote className="text-gray-900 dark:text-gray-100">
                                    <p>{`"${testimonial.body}"`}</p>
                                </blockquote>
                                <div className="mt-6 flex items-center gap-x-4">
                                    <Image
                                        className="h-10 w-10 rounded-full bg-gray-50"
                                        src={testimonial.author.imageUrl}
                                        alt=""
                                        width={40}
                                        height={40}
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author.name}</div>
                                        <div className="text-gray-600 dark:text-gray-400">{`@${testimonial.author.handle}`}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
