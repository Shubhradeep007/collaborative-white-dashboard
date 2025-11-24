"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import Canvas from "./_components/canvas";
import { Room } from "@/components/room";
import Loading from "./_components/loading";

interface BoardIdProps {
  params: Promise<{ boardId: string }>;
}

const BoardIdPage = ({ params }: BoardIdProps) => {
  const { boardId } = use(params);

  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  console.log("Dynamic Board ID:", boardId);
  console.log("Search Params:", query);

  return (
    <Room roomId={boardId} fallback={<Loading />}>
      <Canvas boardId={boardId}  />
    </Room>
  );
};

export default BoardIdPage;
