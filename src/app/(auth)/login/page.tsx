"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

type Props = {
    searchParams?: Record<"callbackUrl" | "error", string>;
}

export default function LoginPage(props: Props) {

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace('/');
        }
    }, [session, router]);

    const usernameRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signIn("credentials", {
            email: usernameRef.current?.value,
            password: passRef.current?.value,
            redirect: true,
            callbackUrl: "http://localhost:3000/"
        });
    }

    return (
        <div className="h-full w-full flex flex-col md:flex-row justify-between bg-[#131619]">
            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center text-white w-full h-full px-4 md:px-0">
                <Link
                    href="/"
                    className="mt-8 md:-mt-60 mb-12 md:mb-60 w-full md:w-[500px] flex flex-row items-center gap-3 justify-center md:justify-start"
                >
                    <Image src="/images/logo.webp" alt="Logo" width={1024} height={1024} className="w-[40px] h-[40px] rounded-2xl" />
                    <p className="font-semibold text-2xl">SwiftSeats</p>
                </Link>

                <div className="flex flex-col w-full md:w-[500px] gap-8 md:gap-20">
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-semibold">Log into your account!</h1>
                        <p className="text-[#9B9C9E]">Let&apos;s remember your bookings!</p>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <p className="text-[#9B9C9E]">Email or username</p>
                            <Input type="text" name="username" placeholder="admin@fabulosu.xyz" className="text-black" ref={usernameRef} required={true} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#9B9C9E]">Password</p>
                            <Input type="password" name="password" placeholder="************" className="text-black" ref={passRef} required={true} />
                        </div>
                        {!!props.searchParams?.error && <p className="text-red-600">Authentication failed!</p>}
                        <Button type="submit" className="mt-5 bg-emerald-500 hover:bg-emerald-600">Log into your account</Button>
                    </div>
                </div>
            </form>

            <div className="hidden lg:block w-auto lg:w-full">
                <Image src="/images/illustration.webp" alt="Illustration" width={970} height={970} className="h-full w-full md:w-auto rounded-l-3xl object-cover" />
            </div>
        </div>
    );

}