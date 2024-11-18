// LoginPage.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

type Props = {
    searchParams?: Record<"callbackUrl" | "error", string>;
}

export default function LoginPage(props: Props) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (session) {
            router.replace('/');
        }
    }, [session, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid credentials");
            } else {
                toast.success("Welcome back!");
                router.push("/");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen w-full flex flex-col md:flex-row bg-[#131619]"
        >
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <Link
                        href="/"
                        className="flex items-center gap-3 mb-12"
                    >
                        <Image
                            src="/images/logo.webp"
                            alt="Logo"
                            width={40}
                            height={40}
                            className="rounded-xl"
                        />
                        <span className="text-white font-semibold text-2xl">SwiftSeats</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Welcome back!</h1>
                        <p className="text-[#9B9C9E]">Let&apos;s get you back to your events.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10 bg-white/10 border-white/20 text-white"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {props.searchParams?.error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-500 text-sm"
                            >
                                Invalid credentials. Please try again.
                            </motion.p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg transition-all duration-200"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </Button>

                        <p className="text-center text-[#9B9C9E]">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-emerald-500 hover:text-emerald-400">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>

            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden lg:block w-1/2"
            >
                <Image
                    src="/images/illustration.webp"
                    alt="Illustration"
                    width={970}
                    height={970}
                    className="h-full w-full object-cover rounded-l-3xl"
                    priority
                />
            </motion.div>
        </motion.div>
    );
}