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
import { Download, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toPng, toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

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

  const onExport = async (type: 'png' | 'jpeg' | 'pdf') => {
    const element = document.getElementById('canvas-svg');
    if (!element) return;

    try {
      const toastId = toast.loading("Exporting...");
      let dataUrl = '';

      // Fetch Google Fonts CSS for Kalam to ensure it's embedded in the export
      let fontEmbedCSS = '';
      try {
        const response = await fetch('https://fonts.googleapis.com/css2?family=Kalam:wght@400&display=swap');
        if (response.ok) {
          fontEmbedCSS = await response.text();
        }
      } catch (e) {
        console.warn("Failed to fetch font CSS", e);
      }

      const options = {
        backgroundColor: '#F5F5F5',
        pixelRatio: 2,
        fontEmbedCSS,
        style: {
          overflow: 'hidden',
        },
        filter: (node: HTMLElement) => {
          const exclusionClasses = ['exclude-from-export'];
          return !exclusionClasses.some((classname) => node.classList?.contains(classname));
        }
      }

      if (type === 'png') {
        dataUrl = await toPng(element, options);
        const link = document.createElement('a');
        link.download = `board-${data?.title || 'untitled'}.png`;
        link.href = dataUrl;
        link.click();
      } else if (type === 'jpeg') {
        dataUrl = await toJpeg(element, { ...options, quality: 0.95 });
        const link = document.createElement('a');
        link.download = `board-${data?.title || 'untitled'}.jpeg`;
        link.href = dataUrl;
        link.click();
      } else if (type === 'pdf') {
        dataUrl = await toPng(element, options);
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
        });
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`board-${data?.title || 'untitled'}.pdf`);
      }
      toast.dismiss(toastId);
      toast.success("Exported successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to export");
      console.error(error);
    }
  }

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
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-transparent hover:bg-white h-12 w-12">
              <Menu />
            </div>
          </Hint>
        </div>
      </Actions>
      <TabSaprator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Hint lebel="Export" side="bottom" sideOffset={10}>
              <Button size="icon" variant="board">
                <Download />
              </Button>
            </Hint>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={10}>
          <DropdownMenuItem onClick={() => onExport('png')} className="cursor-pointer">
            Export as PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('jpeg')} className="cursor-pointer">
            Export as JPEG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('pdf')} className="cursor-pointer">
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px] " />
  );
};
