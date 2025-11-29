"use client";

import { useOrganization } from "@clerk/nextjs";
import EmptyOrg from "./_components/empty-org";
import { useSearchParams } from "next/navigation";
import Boardlist from "./_components/board-list";
import { useEffect } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const searchParams = useSearchParams();
  const paramsObj = Object.fromEntries(searchParams.entries());
  // Remove 'success' param so it doesn't cause validation errors in the board query
  if (paramsObj.success) {
    delete paramsObj.success;
  }



  const { organization } = useOrganization();

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("You are a pro member now!");
    }
  }, [searchParams]);

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
