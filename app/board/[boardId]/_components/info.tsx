'use client';

import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/Hint";
import { useRenameModel } from "@/store/use-rename-modal";
import Actions from "@/components/actions";
import { Menu } from "lucide-react";
interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

const TabSaprator = () => {
  return (
    <div className="text-netural-300 px-1.5">
      |
    </div>
  )
}

export const Info = ({ boardId }: InfoProps) => {

  const { onOpen } = useRenameModel()

  const data = useQuery(api.board.get, { id: boardId as Id<"boards"> })

  if (!data) return Info.Skeleton()

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Hint lebel="Go to dashboard" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2">
          <Link href="/dashboard">
            <Image
              src="/logo.png"
              alt="Spunkboard"
              width={40}
              height={40}
            />
            <span className={cn(
              "font-semibold text-xl ml-2 text-black", font.className
            )}>Sparky Board</span>
          </Link>
        </Button>
      </Hint>
      <TabSaprator />
      <Hint lebel="Rename board" side="bottom" sideOffset={10}>
      <Button
        variant="board"
        className="text-base font-normal px-2 "
        onClick={() => onOpen(data._id, data.title)}
      >
        {data.title}
      </Button>
      </Hint>
      <TabSaprator />
      <Actions
      id={data._id}
      title={data.title} 
      side="bottom"
      sideOffset={10} 
      >
        <div>
          <Hint lebel="Main Menu" side="bottom" sideOffset={10}>
            <Button variant="board" size="icon">
              <Menu/>
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px] " />
  );
};
