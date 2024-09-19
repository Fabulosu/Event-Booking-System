import Image from 'next/image';
import React from 'react';
import { buttonVariants } from './ui/button';
import { FaCalendarMinus } from "react-icons/fa6";
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
    background?: boolean;
}

const Navbar: React.FC<Props> = ({ background = true }) => {
    return (
        <nav className={cn('flex fixed z-50 top-0 px-12 justify-between w-screen h-[90px]', background ? 'bg-white' : '')}>
            <div className='flex flex-row items-center gap-5'>
                <Image src="/images/logo.webp" alt="Logo" width={1024} height={1024} className="w-[40px] h-[40px] rounded-2xl" />
                <p className="font-semibold text-2xl text-white">SwiftSeats</p>
            </div>
            <div className='flex flex-row items-center gap-5'>
                <Link
                    href="/login"
                    className={cn(buttonVariants({ variant: "ghost" }), "hover:bg-neutral-300 text-white")}
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
        </nav >
    )
}

export default Navbar