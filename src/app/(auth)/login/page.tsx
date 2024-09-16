"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Separator } from "@/components/ui/separator";

type Props = {
    searchParams?: Record<"callbackUrl" | "error", string>;
}

export default function LoginPage(props: Props) {

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace('/admin');
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
        <div className="h-[83.5vh] w-full flex justify-center">
            <form onSubmit={onSubmit} className="pt-60 md:pt-60 flex items-center text-primary flex-col w-full md:w-1/2">
                <h1 className="font-bold text-3xl">Welcome back!</h1>
                <p className="text-muted-foreground">Log in to your Linktree.</p>
                <Separator className="w-1/2 mb-4 pt-1 mt-1" />
                <Input type="text" name="username" placeholder="Email or username" className="w-5/6 md:w-2/4 mt-5 text-base font-semibold" ref={usernameRef} required={true} />
                <Input type="password" name="password" placeholder="Password" className="w-5/6 md:w-2/4 mt-2 text-base font-semibold" ref={passRef} required={true} />
                {!!props.searchParams?.error && <p className="text-red-600">Authentication failed!</p>}
                <Button type="submit" className="w-5/6 md:w-2/4 mt-2">Log in</Button>
                <p className="pt-3 text-muted-foreground">You don't have an account? <a href="register" className="transition-all ease-linear duration-200 text-primary hover:text-muted-foreground">Sign up</a></p>

            </form>
        </div>
    )
}