"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import { FaCalendarMinus, FaBars } from "react-icons/fa6";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { FaTimes } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from 'axios';

interface Props {
    background?: boolean;
    className?: string;
}

const Navbar: React.FC<Props> = ({ background = true, className }) => {
    const { data: session, status } = useSession();
    const [userBalance, setUserBalance] = useState(0);

    useEffect(() => {
        const fetchUserBalance = async () => {
            try {
                const response = await axios.get("/api/user/balance");
                if (response) setUserBalance(response.data.balance);
            } catch (error) {
                console.error(error);
            }
        }

        if (session) fetchUserBalance();
    }, [session])

    const handleSignOut = async () => {
        await signOut();
    }

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
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div
                                className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:text-[#329c75]" : "text-white hover:text-[#329c75]", "hover:bg-gray-600/50 hover:cursor-pointer flex flex-row items-center gap-2")}>
                                <Avatar className='w-[30px] h-[30px]'>
                                    <AvatarImage src={session.user.profilePicture} />
                                    <AvatarFallback className={background ? "text-white bg-[#329c75]" : "text-black bg-white"}>{session.user.username.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <p className='font-semibold'>{session.user.username}</p>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Balance: ${userBalance || session.user.balance}</DropdownMenuLabel>
                            <Link href="/profile"><DropdownMenuItem className='hover:cursor-pointer'> Profile</DropdownMenuItem></Link>
                            <Link href="/events"><DropdownMenuItem className='hover:cursor-pointer'>My Events</DropdownMenuItem></Link>
                            <Link href="" onClick={handleSignOut}><DropdownMenuItem className='text-red-600 hover:text-red-700 hover:cursor-pointer'>Sign out</DropdownMenuItem></Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className='flex flex-row items-center'>
                        <Link
                            href="/login"
                            className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:text-[#329c75]" : "text-white hover:text-[#329c75]", "hover:bg-transparent hover:cursor-pointer")}
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className={cn(buttonVariants({ variant: "ghost" }), background ? "text-black hover:text-[#329c75]" : "text-white hover:text-[#329c75]", "hover:bg-transparent hover:cursor-pointer")}
                        >
                            Create an account
                        </Link>
                    </div>
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
                    href="/events/new"
                    className="bg-[#24AE7C] hover:bg-[#329c75] flex gap-2 font-bold text-white py-2 px-4 rounded transition-all"
                    onClick={toggleMenu}
                >
                    <FaCalendarMinus size={20} />Create Event
                </Link>
                <Link
                    href="/explore"
                    className="text-black hover:text-[#329c75] hover:bg-transparent hover:cursor-pointer  transition-all"
                    onClick={toggleMenu}
                >
                    Explore events
                </Link>
                {session && status === "authenticated" ? (
                    <div className='flex flex-col items-center gap-4'>
                        <Link
                            href="/profile"
                            className="text-black hover:text-[#329c75] hover:bg-transparent hover:cursor-pointer transition-all"
                            onClick={toggleMenu}
                        >
                            Your profile
                        </Link>
                        <Button
                            variant="destructive"
                            className="hover:cursor-pointer transition-all"
                            onClick={handleSignOut}
                        >
                            Sign out
                        </Button>
                    </div>

                ) : (
                    <div className='flex flex-col items-center gap-4'>
                        <Link
                            href="/login"
                            className="text-black hover:text-[#329c75] hover:bg-transparent hover:cursor-pointer  transition-all"
                            onClick={toggleMenu}
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/register"
                            className="text-black hover:text-[#329c75] hover:bg-transparent hover:cursor-pointer  transition-all"
                            onClick={toggleMenu}
                        >
                            Create an account
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;