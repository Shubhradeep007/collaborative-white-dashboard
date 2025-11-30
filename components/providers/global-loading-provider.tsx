'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Loader } from 'lucide-react'

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        // Show loading on route change
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true)

        // Hide loading after a short delay to allow page to render
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <>
            {isLoading && (
                <div className='fixed inset-0 h-screen w-screen flex flex-col justify-center items-center bg-white z-50'>
                    <Loader className="h-12 w-12 text-blue-500 animate-spin" />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            )}
            {children}
        </>
    )
}
