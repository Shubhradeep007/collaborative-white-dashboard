'use client'

import { useOrganization } from "@clerk/nextjs"
import EmptyOrg from "./_components/empty-org"
import { useSearchParams } from "next/navigation"



const Dashboard = () => {
    
   const searchParams = useSearchParams();
    const paramsObj = Object.fromEntries(searchParams.entries());

  // console.log({paramsObj});

  console.log('searchParams from page:', searchParams);

  const { organization } = useOrganization()
  return (
      <div className="flex-1 h-[calc(100%-80px)] p-6">
      {JSON.stringify(paramsObj)}
      
      {!organization ? <EmptyOrg /> : <p>Board List</p>}
    </div>
  )
}

export default Dashboard

