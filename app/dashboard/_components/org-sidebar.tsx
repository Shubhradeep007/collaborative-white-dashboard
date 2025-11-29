'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Star, Banknote } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useProModal } from '@/store/use-pro-modal';
import { useOrganization } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect, useState } from 'react';


const font = Poppins({ subsets: ['latin'], weight: ["600"] });

const OrgSidebar = () => {


  const searchParams = useSearchParams();
  const favorites = searchParams.get('favorites');
  const { onOpen } = useProModal();

  const { organization } = useOrganization();
  const subscription = useQuery(api.subscriptions.get,
    organization ? { orgId: organization.id } : "skip"
  );

  const isPro = !!subscription?.isValid;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }


  return (
    <div className="hidden lg:flex flex-col w-[206px] pl-5 pt-5">
      <Link href="/">
        <div className='flex items-center gap-x-2'>
          <Image
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
          />
          <span className={cn(
            "text-2xl font-semibold text-gray-800",
            font.className
          )}>Sparky Board</span>
        </div>
      </Link>

      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: "20px",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white"
            }
          }
        }}
      />


      <div className='space-x-3 mt-3 w-full'>
        <Button asChild
          size="lg"
          variant={favorites ? "ghost" : "secondary"}
          className='font-normal justify-start px-2 w-full'>
          <Link href="/dashboard">
            <LayoutDashboard className='h-4 w-4 mr-2' />
            Team Boards
          </Link>
        </Button>

        <Button asChild size="lg" variant={favorites ? "secondary" : "ghost"} className='font-normal justify-start px-2 w-full'>
          <Link href={{
            pathname: "/dashboard",
            query: { favorites: true }
          }}>
            <Star className='h-4 w-4 mr-2' />
            Favorite Boards
          </Link>
        </Button>
      </div>

      <div className="space-y-1 w-full mt-auto mb-4">
        <Button
          onClick={isPro ? undefined : onOpen}
          disabled={isPro}
          size="lg"
          className="font-normal justify-start px-2 w-full"
          variant={isPro ? "ghost" : "ghost"}
        >
          <Banknote className="h-4 w-4 mr-2" />
          {isPro ? "Pro Member" : "Upgrade to Pro"}
        </Button>

        {isPro && (
          <div className="flex items-center gap-x-2 px-2 py-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Active Subscription</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgSidebar;
