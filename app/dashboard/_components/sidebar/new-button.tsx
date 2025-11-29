"use client";

import { Hint } from "@/components/Hint";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";

const Newbutton = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="aspect-square">
            <Hint lebel="Create New Organization" side="right" align="start" sideOffset={18}>
              <button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition cursor-pointer">
                <Plus className="text-white" />
              </button>
            </Hint>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-[480px] bg-background border rounded-xl p-6 shadow-xl">
          <DialogTitle className="sr-only">Create Organization</DialogTitle>
          <CreateOrganization />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Newbutton;
