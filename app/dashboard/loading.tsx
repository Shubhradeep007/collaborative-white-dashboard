import { Loader } from 'lucide-react'

export default function DashboardLoading() {
    return (
        <div className='fixed inset-0 h-screen w-screen flex flex-col justify-center items-center bg-white z-50'>
            <Loader className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
    )
}
