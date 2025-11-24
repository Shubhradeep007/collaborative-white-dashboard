"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import EmptyBoards from "./empty-board";
import EmptyFavriotes from "./empty-favriotes";
import EmptySeach from "./empty-search";

import NewBoardButton from "./new-board-button";
import { BoardCard } from "./board-card";

interface BoradListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

const Boardlist = ({ orgId, query }: BoradListProps) => {
  const data = useQuery(api.boards.get, { 
    orgId,
    ...query,
  });

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl ">
          {query.favorites ? "Favorite Boards" : "Team Boards"}
        </h2>

        <div className="grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disable />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );
  }

  if (!data.length && query.search) {
    return <EmptySeach />;
  }

  if (query.favorites && !data.length) {
    return <EmptyFavriotes />;
  }

  if (!data.length) {
    return <EmptyBoards />;
  }

  return (
    <>
      <div>
        <h2 className="text-3xl ">
          {query.favorites ? "Favorite Boards" : "Team Boards"}
        </h2>

        <div className="grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} />
          {data?.map((board) => (
            <BoardCard
              key={board._id}
              id={board._id}
              title={board.title}
              imageUrl={board.imageUrl}
              authorId={board.authorId}
              authorName={board.authorName}
              createdAt={board._creationTime}
              orgId={board.orgId}
              isFavriotes={board.isFavorite}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Boardlist;
