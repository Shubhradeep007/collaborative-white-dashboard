import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CreateOrganization } from "@clerk/nextjs"
import Image from "next/image"

const EmptyOrg = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
        <Image 
        src="/dashboardlogo.svg"
        alt="empty"
        height={300}
        width={300}
        />
        <h2 className="text-2xl font-semibold mt-6">
            Welcome to Spark Board 
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
            Create an Organization to get started
        </p>

        <div className="mt-6">
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="lg" >
                        Create an organization
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <CreateOrganization />
                </DialogContent>
            </Dialog>
        </div>
    </div>
  )
}

export default EmptyOrg