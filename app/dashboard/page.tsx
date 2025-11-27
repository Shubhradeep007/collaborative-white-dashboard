"use client";

import { useOrganization } from "@clerk/nextjs";
import EmptyOrg from "./_components/empty-org";
import { useSearchParams } from "next/navigation";
import Boardlist from "./_components/board-list";

const Dashboard = () => {
  const searchParams = useSearchParams();
  const paramsObj = Object.fromEntries(searchParams.entries());



  const { organization } = useOrganization();
  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <>
          <EmptyOrg />
        </>
      ) : (
        <>
          <Boardlist orgId={organization.id} query={paramsObj} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
