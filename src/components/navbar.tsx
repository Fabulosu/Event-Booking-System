import Image from 'next/image';
import React from 'react';
import { buttonVariants } from './ui/button';
import { FaCalendarMinus } from "react-icons/fa6";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface Props {
    background?: boolean;
    className?: string;
}

const Navbar: React.FC<Props> = ({ background = true, className }) => {
    return (
        <nav className={cn('flex fixed z-50 top-0 px-12 justify-between w-screen h-[80px]', background ? 'bg-white' : '', className)}>
            <div className='flex flex-row items-center gap-2'>
                <Link
                    href="/"
                    className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:text-[#329c75]" : "text-white hover:text-[#329c75]", "hover:bg-transparent hover:cursor-pointer flex flex-row gap-3")}
                >
                    <Image src="/images/logo.webp" alt="Logo" width={1024} height={1024} className="w-[40px] h-[40px] rounded-2xl" />
                    <p className={cn("font-semibold text-2xl", background ? "text-black" : "text-white")}>SwiftSeats</p>
                </Link>
                <Separator orientation='vertical' className='bg-muted-foreground h-1/3' />
                <Link
                    href="/explore"
                    className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:text-[#329c75]" : "text-white hover:bg-[#329c75]", "hover:bg-transparent hover:cursor-pointer")}
                >
                    Explore events
                </Link>
            </div>
            <div className='flex flex-row items-center gap-5'>
                <Link
                    href="/login"
                    className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:bg-neutral-300/50 hover:text-[#329c75]" : "text-white hover:bg-neutral-300/50 hover:text-[#329c75]")}
                >
                    Greetings! Sign in
                </Link>
                <Link
                    href="/events/new"
                    className={cn(buttonVariants({ size: "lg" }), "bg-[#24AE7C] hover:bg-[#329c75] flex gap-2 font-bold")}
                >
                    <FaCalendarMinus size={20} />Create Event
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;