'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Star } from 'lucide-react';
import { useSearchParams } from 'next/navigation';


const font = Poppins({ subsets: ['latin'], weight: ["600"] });

const OrgSidebar = () => {


  const searchParams = useSearchParams();
  const favorites = searchParams.get('favorites');


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
          <LayoutDashboard className='h-4 w-4 mr-2'/>
          Team Borards
          </Link>
        </Button>

        <Button asChild size="lg" variant={favorites ? "secondary" : "ghost"} className='font-normal justify-start px-2 w-full'>
          <Link href={{
            pathname: "/dashboard",
            query: { favorites: true }
          }}>
          <Star className='h-4 w-4 mr-2'/>
          Favorite Borards
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrgSidebar;
