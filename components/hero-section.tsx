"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "./header";
import Image from "next/image";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-30">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700"
              style={{
                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
            />
          </div>
        </div>

        {/* Hero Content */}
        <section className="relative px-6 pt-24 pb-16 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-600/10 dark:ring-blue-400/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Real-time Collaboration
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl">
                Where Ideas
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Take Shape
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                A modern, collaborative whiteboard for teams. Draw, brainstorm, and build together in real-time.
                Perfect for remote teams, designers, and creative minds.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button asChild size="lg" className="rounded-full px-8 text-base shadow-lg hover:shadow-xl transition-all">
                  <Link href="/dashboard">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

              </div>

              {/* Trust indicators */}
              <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                Trusted by creative teams worldwide • No credit card required
              </p>
            </div>

            {/* Screenshot/Demo Section */}
            <div className="mt-16 sm:mt-24">
              <div className="relative mx-auto max-w-5xl">
                <div className="absolute -inset-x-4 -inset-y-4 -z-10 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl" />
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                  <Image
                    src="/home2.jpg"
                    alt="Sparky Board Interface"
                    width={2700}
                    height={1440}
                    className="rounded-xl w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Real-time Sync</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  See changes instantly as your team collaborates. No delays, no conflicts.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Team Collaboration</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Invite unlimited team members. Work together seamlessly from anywhere.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Powerful Tools</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Draw, write, add shapes, and more with our intuitive toolset.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}



const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};


