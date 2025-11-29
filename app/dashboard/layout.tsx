import React, { Suspense } from "react";
import Sidebar from "./_components/sidebar";
import OrgSidebar from "./_components/org-sidebar";
import Navbar from "./_components/navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full flex">
      <Sidebar />

      <div className="flex flex-1 pl-[60px]">
        <div className="flex h-full w-full">
          <Suspense>
            <OrgSidebar />
          </Suspense>

          <div className="flex-1 h-full overflow-auto">
            <Suspense>
              <Navbar />
            </Suspense>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default layout;
