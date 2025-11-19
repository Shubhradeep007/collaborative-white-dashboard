"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { p } from "motion/react-client";

import React from "react";
import Item from "./item";

const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships.data?.length) return null;
  return (
    <>
      <ul className="space-y-4">
        {userMemberships.data?.map((mem) => (
          <Item 
        key={mem.organization.id}
        id={mem.organization.id}
        name={mem.organization.name || "Organization"}
        imageUrl={mem.organization.imageUrl}
          />
        ))}
      </ul>
    </>
  );
};

export default List;
