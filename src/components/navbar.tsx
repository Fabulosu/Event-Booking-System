"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { buttonVariants } from './ui/button';
import { FaCalendarMinus, FaBars } from "react-icons/fa6";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { FaTimes } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
    background?: boolean;
    className?: string;
}

const Navbar: React.FC<Props> = ({ background = true, className }) => {
    const { data: session, status } = useSession();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className={cn('fixed z-50 top-0 w-full h-[80px] flex justify-between items-center px-4 md:px-12', background ? 'bg-white' : '', className)}>
            <div className='flex flex-row items-center gap-2'>
                <Link
                    href="/"
                    className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:text-[#329c75]" : "text-white hover:text-[#329c75]", "hover:bg-transparent hover:cursor-pointer flex flex-row gap-3")}
                >
                    <Image src="/images/logo.webp" alt="Logo" width={1024} height={1024} className="w-[40px] h-[40px] rounded-2xl" />
                    <p className={cn("font-semibold text-2xl", background ? "text-black" : "text-white")}>SwiftSeats</p>
                </Link>
                <Separator orientation='vertical' className='hidden md:block bg-muted-foreground h-1/3' />
                <Link
                    href="/explore"
                    className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:text-[#329c75]" : "text-white hover:text-[#329c75]", "hover:bg-transparent hover:cursor-pointer hidden md:block")}
                >
                    Explore events
                </Link>
            </div>

            <div className='hidden md:flex flex-row items-center gap-5'>
                {session && status === "authenticated" ? (
                    <Link
                        href="/profile"
                        className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:text-[#329c75]" : "text-white hover:text-[#329c75]", "hover:bg-gray-600/50 hover:cursor-pointer flex flex-row items-center gap-2")}>
                        <Avatar className='w-[30px] h-[30px]'>
                            <AvatarImage src={session.user.profilePicture} />
                            <AvatarFallback className={background ? "text-white bg-[#329c75]" : "text-black bg-white"}>{session.user.username.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <p className='font-semibold'>{session.user.username}</p>
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="text-white hover:text-[#329c75] hover:bg-transparent hover:cursor-pointer"
                    >
                        Greetings! Sign in
                    </Link>
                )}
                <Link
                    href="/events/new"
                    className={cn(buttonVariants({ size: "lg" }), "bg-[#24AE7C] hover:bg-[#329c75] flex gap-2 font-bold")}
                >
                    <FaCalendarMinus size={20} />Create Event
                </Link>
            </div>

            <div className='flex md:hidden items-center'>
                <button onClick={toggleMenu} aria-label="Toggle navigation bar menu" className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:text-[#329c75]" : "text-white hover:text-[#329c75]")}>
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            <div
                className={cn(
                    'absolute top-[80px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden overflow-hidden transition-all duration-300',
                    isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                )}
                style={{ transitionProperty: 'max-height, opacity' }}
            >
                <Link
                    href="/explore"
                    className="text-black hover:text-[#329c75] hover:bg-transparent hover:cursor-pointer  transition-all"
                    onClick={toggleMenu}
                >
                    Explore events
                </Link>
                {session && status === "authenticated" ? (
                    <Link
                        href="/profile"
                        className="text-black hover:text-[#329c75] hover:bg-transparent hover:cursor-pointer transition-all"
                        onClick={toggleMenu}
                    >
                        Your profile
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="text-black hover:text-[#329c75] hover:bg-transparent hover:cursor-pointer  transition-all"
                        onClick={toggleMenu}
                    >
                        Greetings! Sign in
                    </Link>
                )}
                <Link
                    href="/events/new"
                    className="bg-[#24AE7C] hover:bg-[#329c75] flex gap-2 font-bold text-white py-2 px-4 rounded transition-all"
                    onClick={toggleMenu}
                >
                    <FaCalendarMinus size={20} />Create Event
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;