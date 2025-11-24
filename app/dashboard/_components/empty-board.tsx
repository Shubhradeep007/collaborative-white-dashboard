'use clients'

import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";
import { api } from '@/convex/_generated/api'
import Image from "next/image";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const EmptyBoards = () => {

  const router = useRouter()
  const { organization } = useOrganization()
  const { mutate, pending } = useApiMutation(api.board.create)

  const onClick = () => {

    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "untitled"
    })
    .then((id) => {
      toast.success("Board Created")
      router.push(`/board/${id}`)
        // todo redirt to borad/id
    })
    .catch(() => toast.error("Failed to create board"))
  }

  return (
    <>
      <div className="h-full flex flex-col items-center justify-center">
        <Image src="" alt="Empty" height={140} width={140} />

        <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>

        <p className="text-muted-foreground text-sm mt-2">
          Start by crating a board got your organization
        </p>

        <div className="mt-6">
          <Button size="lg" disabled={pending} onClick={onClick} className="cursor-pointer">
            Create Board
          </Button>
        </div>
      </div>

    </>
  );
};

export default EmptyBoards;
