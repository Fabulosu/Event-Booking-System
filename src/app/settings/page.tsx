"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, User, Shield, Mail, Lock, Eye, Globe } from "lucide-react";
import Navbar from "@/components/navbar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface UserSettings {
    public_email: boolean;
    public_profile: boolean;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (session?.user.id) {
            const fetchUserSettings = async () => {
                try {
                    const { data } = await axios.get(`/api/user/${session.user.id}`);
                    if (data.success) {
                        setUserSettings(data.user);
                    } else {
                        toast.error("Failed to load user settings.");
                    }
                } catch (error) {
                    toast.error("An error occurred while fetching user settings.");
                }
            };

            fetchUserSettings();
        }
    }, [session?.user.id]);

    const handleUsernameChange = async () => {
        const username = usernameRef.current?.value.trim();
        if (!username || username.length < 5) {
            toast.error("The username must be at least 5 characters long!");
            return;
        }

        try {
            setIsUpdatingUsername(true);
            const { data } = await axios.put(`/api/user/${session?.user.id}`, { username });
            if (data.success) {
                toast.success("Username updated successfully!");
                update(); // Optionally update session data
            } else {
                toast.error("Failed to update username.");
            }
        } catch {
            toast.error("An error occurred while updating username.");
        } finally {
            setIsUpdatingUsername(false);
        }
    };

    const handleEmailChange = async () => {
        const email = emailRef.current?.value.trim();
        if (!email || !emailRegex.test(email)) {
            toast.error("Please enter a valid email address!");
            return;
        }

        try {
            setIsUpdatingEmail(true);
            const { data } = await axios.put(`/api/user/${session?.user.id}`, { email });
            if (data.success) {
                toast.success("Email updated successfully!");
                update();
            } else {
                toast.error("Failed to update email.");
            }
        } catch {
            toast.error("An error occurred while updating email.");
        } finally {
            setIsUpdatingEmail(false);
        }
    };

    const handlePasswordChange = async () => {
        const currentPassword = currentPasswordRef.current?.value;
        const newPassword = newPasswordRef.current?.value;

        if (!newPassword || newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            toast.error("Password must be at least 8 characters, with at least one uppercase letter and one number.");
            return;
        }

        try {
            setIsUpdatingPassword(true);
            const { data } = await axios.put(`/api/user/${session?.user.id}`, {
                currentPassword,
                newPassword,
            });

            if (data.success) {
                toast.success("Password updated successfully!");
            } else {
                console.log(data.message)
                toast.error(data.message || "Failed to update password.");
            }
        } catch {
            toast.error("An error occurred while updating password.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleSwitchChange = async (field: "public_email" | "public_profile", value: boolean) => {
        try {
            const { data } = await axios.put(`/api/user/${session?.user.id}`, { [field]: value });
            if (data.success) {
                toast.success(`${field.replace("_", " ")} updated successfully!`);
            } else {
                toast.error(`Failed to update ${field.replace("_", " ")}.`);
            }
        } catch {
            toast.error("An error occurred while updating privacy settings.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background pt-16">
                <div className="mx-auto max-w-5xl px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                            <p className="text-muted-foreground">
                                Manage your account settings and preferences.
                            </p>
                        </div>

                        <Tabs defaultValue="account" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4 gap-4 bg-transparent h-auto p-0">
                                {[
                                    { value: "account", label: "Account", icon: User },
                                    { value: "privacy", label: "Privacy", icon: Shield },
                                    { value: "notifications", label: "Notifications", icon: Bell },
                                ].map(({ value, label, icon: Icon }) => (
                                    <TabsTrigger
                                        key={value}
                                        value={value}
                                        className="data-[state=active]:bg-[#24AE7C] data-[state=active]:text-primary-foreground flex flex-col items-center justify-center gap-2 p-4 h-24"
                                    >
                                        <Icon className="h-5 w-5" />
                                        {label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value="account" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                <CardTitle className="text-lg">Username</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <Input
                                                defaultValue={session?.user.username}
                                                className="shadow-xl"
                                                ref={usernameRef}
                                                disabled={isUpdatingUsername}
                                            />
                                            <Button
                                                className="w-full bg-[#24AE7C] hover:bg-[#329c75]"
                                                onClick={handleUsernameChange}
                                                disabled={isUpdatingUsername}
                                            >
                                                Update Username
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                <CardTitle className="text-lg">Email</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <Input defaultValue={session?.user.email} className="shadow-xl" ref={emailRef} disabled={isUpdatingEmail} />
                                            <Button className="w-full bg-[#24AE7C] hover:bg-[#329c75]" onClick={handleEmailChange} disabled={isUpdatingEmail}>Update Email</Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="md:col-span-2">
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <Lock className="h-4 w-4" />
                                                <CardTitle className="text-lg">Password</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Current Password</Label>
                                                    <Input type="password" className="shadow-xl" ref={currentPasswordRef} disabled={isUpdatingPassword} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>New Password</Label>
                                                    <Input type="password" className="shadow-xl" ref={newPasswordRef} disabled={isUpdatingPassword} />
                                                </div>
                                            </div>
                                            <Button className="w-full bg-[#24AE7C] hover:bg-[#329c75]" onClick={handlePasswordChange} disabled={isUpdatingPassword}>Change Password</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="privacy" className="space-y-4">
                                <div className="grid gap-4">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="h-4 w-4" />
                                                        <h4 className="font-medium">Profile Visibility</h4>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Make your profile visible to everyone
                                                    </p>
                                                </div>
                                                <Switch defaultChecked={userSettings?.public_profile} onCheckedChange={(value) => handleSwitchChange("public_profile", value)} />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        <h4 className="font-medium">Public Email</h4>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Show your email on your public profile
                                                    </p>
                                                </div>
                                                <Switch defaultChecked={userSettings?.public_email} onCheckedChange={(value) => handleSwitchChange("public_email", value)} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="notifications" className="space-y-4">
                                <div className="grid gap-4">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Bell className="h-4 w-4" />
                                                        <h4 className="font-medium">Email Notifications</h4>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive notifications about your account
                                                    </p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" />
                                                        <h4 className="font-medium">Marketing Emails</h4>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive emails about new features
                                                    </p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </div>
        </>
    )
}