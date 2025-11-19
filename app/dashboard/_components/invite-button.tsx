"use client";


import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { OrganizationProfile } from "@clerk/nextjs";
import { Plus } from "lucide-react";

const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Invite Members
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          w-[90%] 
          max-w-[420px] 
      
          sm:max-w-[600px] 
          md:max-w-[700px] 
          lg:max-w-[880px]
          bg-background 
          p-6 
          rounded-xl 
          shadow-2xl 
          border
        "
      >
        <OrganizationProfile
  appearance={{
    elements: {
      rootBox: {
        width: "100%",
        maxHeight: "480px",
        overflowY: "auto",
      },
      profilePage: {
        padding: "16px",
      },
      card: {
        padding: "16px",
        borderRadius: "10px",
      },
      navbar: {
        padding: "8px",
        width: "140px",
      },
      navbarItem: {
        padding: "6px 8px",
        fontSize: "13px",
      },
      profileSection__profile: {
        padding: "12px",
        gap: "8px",
      },
    },
  }}
/>

      </DialogContent>
    </Dialog>
  );
};

export default InviteButton;
