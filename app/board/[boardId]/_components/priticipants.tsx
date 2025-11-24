'use client'

import { UserAvatar } from "./user-avatar";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

const MAX_SHOWN_USERS = 2

export const Priticipants = () => {
  const users = useOthers()
  const currentUser = useSelf()

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
      List of users
    </div>
  );
};

Priticipants.Skeleton = function PriticipantsSkeleton() {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]" />
  );
};
