"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {

    const { data: session } = useSession();
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('');

    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const cpassRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (session) {
            router.replace('/');
        }

    }, [session, router]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const username = usernameRef.current?.value;
        const email = emailRef.current?.value;
        const password = passRef.current?.value;
        const cpass = cpassRef.current?.value;

        if (username && email && password && cpass) {
            try {
                if (password.length >= 8) {
                    if (password === cpass) {
                        const response = await axios.post("/api/auth/register", { username, email, password });
                        if (response.data.success) {
                            setErrorMessage("Account successfully created!")
                        } else {
                            setErrorMessage(response.data.message);
                        }
                    } else {
                        setErrorMessage("Passwords do not match!");
                    }
                } else {
                    setErrorMessage("The password must be at least 8 characters!");
                }

            } catch (error) {
                console.error('Error creating account:', error);
            }

        }
    }

    return (
        <div className="h-[83.5vh] w-full flex justify-center">
            <form onSubmit={onSubmit} className="pt-60 md:pt-60 flex items-center text-primary flex-col w-full md:w-1/2">
                <h1 className="font-bold text-3xl">Join Linktr.ee</h1>
                <p className="text-muted-foreground">Sign up for free!</p>
                <Separator className="w-1/2 mb-4 pt-1 mt-1" />
                <Input type="text" name="username" placeholder="Username" className="w-5/6 md:w-2/4 mt-5 text-base font-semibold" ref={usernameRef} required={true} />
                <Input type="email" name="email" placeholder="Email" className="w-5/6 md:w-2/4 mt-2 text-base font-semibold" ref={emailRef} />
                <Input type="password" name="password" placeholder="Password" className="w-5/6 md:w-2/4 mt-2 text-base font-semibold" ref={passRef} />
                <Input type="password" name="cpass" placeholder="Confirm password" className="w-5/6 md:w-2/4 mt-2 text-base font-semibold" ref={cpassRef} />
                {errorMessage && <p className="w-5/6 md:w-2/4 text-center p-3 bg-red-400 rounded-md mt-2 text-red-600 font-bold">{errorMessage}</p>}
                <Button type="submit" className="w-5/6 md:w-2/4 mt-2">Create account</Button>
                <p className="pt-3 text-muted-foreground">You have an account? <a href="login" className="transition-all ease-linear duration-200 text-primary hover:text-muted-foreground">Login</a></p>
            </form>
        </div>
    )
}