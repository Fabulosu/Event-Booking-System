"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {

    const { data: session } = useSession();
    const router = useRouter();

    // const [errorMessage, setErrorMessage] = useState('');

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
                        await axios.post("/api/auth/register", { username, email, password });
                        // if (response.data.success) {
                        //     setErrorMessage("Account successfully created!")
                        // } else {
                        //     setErrorMessage(response.data.message);
                        // }
                    } else {
                        // setErrorMessage("Passwords do not match!");
                    }
                } else {
                    // setErrorMessage("The password must be at least 8 characters!");
                }

            } catch (error) {
                console.error('Error creating account:', error);
            }

        }
    }

    return (
        <div className="h-full w-full flex flex-col md:flex-row justify-between bg-[#131619]">
            <form onSubmit={onSubmit} className="flex flex-col justify-center items-center text-white w-full h-full px-4 md:px-0">
                <Link
                    href="/"
                    className="mt-8 md:-mt-36 mb-12 md:mb-60 w-full md:w-[500px] flex flex-row items-center gap-3 justify-center md:justify-start"
                >
                    <Image src="/images/logo.webp" alt="Logo" width={1024} height={1024} className="w-[40px] h-[40px] rounded-2xl" />
                    <p className="font-semibold text-2xl">SwiftSeats</p>
                </Link>

                <div className="flex flex-col w-full md:w-[500px] gap-8 md:gap-20">
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-semibold">Create an account!</h1>
                        <p className="text-[#9B9C9E]">Get started to participate in any event!</p>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1">
                            <p className="text-[#9B9C9E]">Username</p>
                            <Input type="text" name="username" placeholder="Fabulosu" className="text-black" ref={usernameRef} required={true} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#9B9C9E]">Email</p>
                            <Input type="email" name="email" placeholder="admin@fabulosu.xyz" className="text-black" ref={emailRef} required={true} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#9B9C9E]">Password</p>
                            <Input type="password" name="password" placeholder="************" className="text-black" ref={passRef} required={true} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#9B9C9E]">Confirm your password</p>
                            <Input type="password" name="cpass" placeholder="************" className="text-black" ref={cpassRef} required={true} />
                        </div>
                        <Button type="submit" className="mt-5 bg-emerald-500 hover:bg-emerald-600">Create account</Button>
                    </div>
                </div>
            </form>

            <div className="hidden lg:block w-auto lg:w-full">
                <Image src="/images/illustration.webp" alt="Illustration" width={970} height={970} className="h-full w-full md:w-auto rounded-l-3xl object-cover" />
            </div>
        </div>
    );

}