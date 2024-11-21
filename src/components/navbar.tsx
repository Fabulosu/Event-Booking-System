"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import { FaCalendarMinus, FaBars, FaTimes } from "react-icons/fa";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from 'next-auth';

interface Props {
    background?: boolean;
    className?: string;
}

const NavLink = ({ href, children, className, onClick }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) => (
    <Link
        href={href}
        className={className}
        onClick={onClick}
    >
        {children}
    </Link>
);

const Navbar: React.FC<Props> = ({ background = true, className }) => {
    const { data: session, status } = useSession();
    const [userBalance, setUserBalance] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
    }, [session]);

    const handleSignOut = async () => {
        await signOut();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navbarClassName = cn(
        'fixed z-50 top-0 w-full h-[80px] flex justify-between items-center px-4 md:px-12',
        'transition-all duration-300',
        {
            'bg-white shadow-md': background || isScrolled,
            'bg-transparent': !background && !isScrolled
        },
        className
    );

    const linkClassName = cn(
        buttonVariants({ variant: "ghost" }),
        "transition-colors duration-300",
        {
            'text-black hover:text-[#329c75]': background || isScrolled,
            'text-white hover:text-[#329c75]': !background && !isScrolled
        },
        "hover:bg-transparent hover:cursor-pointer"
    );

    return (
        <nav className={navbarClassName}>
            <div className='flex flex-row items-center gap-2'>
                <NavLink href="/" className={cn(linkClassName, "flex flex-row gap-3")}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Image
                            src="/images/logo.webp"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="rounded-2xl"
                            priority
                        />
                    </motion.div>
                    <p className={cn("font-semibold text-2xl", {
                        "text-black": background || isScrolled,
                        "text-white": !background && !isScrolled
                    })}>
                        SwiftSeats
                    </p>
                </NavLink>
                <Separator orientation='vertical' className='hidden md:block bg-muted-foreground h-1/3' />
                <NavLink href="/explore" className={cn(linkClassName, "hidden md:block")}>
                    Explore events
                </NavLink>
            </div>

            <div className='hidden md:flex flex-row items-center gap-5'>
                {session && status === "authenticated" ? (
                    <UserMenu
                        session={session}
                        userBalance={userBalance}
                        handleSignOut={handleSignOut}
                        background={background}
                        isScrolled={isScrolled}
                    />
                ) : (
                    <AuthLinks background={background} isScrolled={isScrolled} />
                )}
                <CreateEventButton />
            </div>

            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
                className={cn(buttonVariants({ variant: "ghost" }), {
                    'text-black': background || isScrolled,
                    'text-white': !background && !isScrolled
                }, 'md:hidden')}
            >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.button>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[80px] left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden"
                    >
                        <MobileMenuContent
                            session={session}
                            status={status}
                            handleSignOut={handleSignOut}
                            toggleMenu={toggleMenu}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const UserMenu = ({ session, userBalance, handleSignOut, background, isScrolled }: {
    session: Session;
    userBalance: number;
    handleSignOut: () => void;
    background: boolean;
    isScrolled: boolean;
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <motion.div
                whileHover={{ scale: 1.05 }}
                className={cn(buttonVariants({ variant: "ghost" }), {
                    'text-black hover:text-[#329c75]': background || isScrolled,
                    'text-white hover:text-[#329c75]': !background && !isScrolled
                }, "hover:bg-gray-600/50 hover:cursor-pointer flex flex-row items-center gap-2")}
            >
                <Avatar className='w-[30px] h-[30px]'>
                    <AvatarImage src={`/uploads/${session.user.profilePicture}`} />
                    <AvatarFallback className={background || isScrolled ? "text-white bg-[#329c75]" : "text-black bg-white"}>
                        {session.user.username.slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <p className='font-semibold'>{session.user.username}</p>
            </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Balance: ${userBalance || session.user.balance}</DropdownMenuLabel>
            <NavLink href={`/profile/${session.user.id}`}>
                <DropdownMenuItem className='hover:cursor-pointer'>Profile</DropdownMenuItem>
            </NavLink>
            <NavLink href="/events">
                <DropdownMenuItem className='hover:cursor-pointer'>My Events</DropdownMenuItem>
            </NavLink>
            <DropdownMenuItem
                className='text-red-600 hover:text-red-700 hover:cursor-pointer'
                onClick={handleSignOut}
            >
                Sign out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const AuthLinks = ({ background, isScrolled }: {
    background: boolean;
    isScrolled: boolean;
}) => (
    <div className='flex flex-row items-center gap-2'>
        <NavLink
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }), {
                'text-black hover:text-[#329c75]': background || isScrolled,
                'text-white hover:text-[#329c75]': !background && !isScrolled
            }, "hover:bg-transparent")}
        >
            Login
        </NavLink>
        <NavLink
            href="/register"
            className={cn(buttonVariants({ variant: "default" }),
                "bg-[#24AE7C] hover:bg-[#329c75]"
            )}
        >
            Create an account
        </NavLink>
    </div>
);

const CreateEventButton = () => (
    <NavLink
        href="/events/new"
        className={cn(
            buttonVariants({ size: "lg" }),
            "bg-[#24AE7C] hover:bg-[#329c75] flex gap-2 font-bold"
        )}
    >
        <FaCalendarMinus size={20} />Create Event
    </NavLink>
);

const MobileMenuContent = ({ session, status, handleSignOut, toggleMenu }: {
    session: Session | null;
    status: string;
    handleSignOut: () => void;
    toggleMenu: () => void;
}) => (
    <>
        <CreateEventButton />
        <NavLink
            href="/explore"
            className="text-black hover:text-[#329c75] transition-all"
            onClick={toggleMenu}
        >
            Explore events
        </NavLink>
        {session && status === "authenticated" ? (
            <div className='flex flex-col items-center gap-4'>
                <NavLink
                    href={`/profile/${session.user.id}`}
                    className="text-black hover:text-[#329c75] transition-all"
                    onClick={toggleMenu}
                >
                    Your profile
                </NavLink>
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
                <NavLink
                    href="/login"
                    className="text-black hover:text-[#329c75] transition-all"
                    onClick={toggleMenu}
                >
                    Sign in
                </NavLink>
                <NavLink
                    href="/register"
                    className="text-black hover:text-[#329c75] transition-all"
                    onClick={toggleMenu}
                >
                    Create an account
                </NavLink>
            </div>
        )}
    </>
);

export default Navbar;