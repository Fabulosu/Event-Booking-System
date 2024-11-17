"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaRegClock, FaRegCalendar, FaShare } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/navbar";
import BottomBar from "@/components/bottombar";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface Event {
    _id: string;
    title: string;
    address: string;
    date: string;
    price: number;
    description: string;
    category: string;
    availableSeats: number;
    bookedSeats: number;
    organizer: {
        username: string;
        profilePicture?: string;
    };
    imageUrl: string;
}

const EventSkeleton = () => (
    <div className="flex flex-col px-4 md:px-12 animate-pulse">
        <Skeleton className="w-full h-[300px] md:h-[500px]" />
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mt-6">
            <div className="w-full lg:w-1/2 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="w-full lg:w-1/2">
                <Skeleton className="h-[300px] w-full" />
            </div>
        </div>
    </div>
);

export default function EventPage({ params }: { params: { id: string } }) {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setEvent(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error);
                    toast.error(errorData.error);
                }
            } catch (err) {
                setError("Failed to fetch event data.");
                toast.error("Failed to fetch event data.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [params.id]);

    const handleShare = async () => {
        try {
            await navigator.share({
                title: event?.title,
                text: event?.description,
                url: window.location.href,
            });
        } catch (err) {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <div className="relative w-full min-h-screen bg-gray-50">
                <Navbar className="relative" />
                <EventSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative w-full min-h-screen bg-gray-50">
                <Navbar className="relative" />
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <Button onClick={() => window.history.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-gray-50">
            <Navbar className="relative" />
            {event && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col pb-24"
                    >
                        <div className="relative w-full h-[300px] md:h-[500px]">
                            <Image
                                src={event.imageUrl ? `/uploads/${event.imageUrl}` : "/images/mockhead.jpg"}
                                fill
                                priority
                                alt={event.title}
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute top-4 right-4"
                                onClick={handleShare}
                            >
                                <FaShare className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="container mx-auto px-4 -mt-20 relative z-10">
                            <Card className="p-6">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="w-full lg:w-2/3 space-y-6">
                                        <div>
                                            <Badge className="mb-4">{event.category}</Badge>
                                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                                {event.title}
                                            </h1>
                                            <p className="text-gray-600 leading-relaxed">{event.description}</p>
                                        </div>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={event.organizer.profilePicture} />
                                                        <AvatarFallback>
                                                            {event.organizer.username.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Organized by</p>
                                                        <p className="font-semibold">{event.organizer.username}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <IoLocationOutline className="text-[#24AE7C] w-5 h-5" />
                                                    <p className="text-gray-700">{event.address}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaRegCalendar className="text-[#24AE7C] w-5 h-5" />
                                                    <p className="text-gray-700">
                                                        {new Date(event.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaRegClock className="text-[#24AE7C] w-5 h-5" />
                                                    <p className="text-gray-700">
                                                        {new Date(event.date).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="w-full lg:w-1/3">
                                        <Card className="sticky top-24">
                                            <CardContent className="p-4">
                                                <div className="space-y-4">
                                                    <h3 className="text-xl font-semibold">Event Location</h3>
                                                    <div className="aspect-video relative rounded-lg overflow-hidden">
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            loading="lazy"
                                                            allowFullScreen
                                                            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&q=${encodeURIComponent(event.address)}&zoom=15`}
                                                            className="border-0"
                                                        />
                                                    </div>
                                                    <div className="pt-4 border-t">
                                                        <p className="text-sm text-gray-500 mb-2">Available Seats</p>
                                                        <p className="text-2xl font-bold text-[#24AE7C]">
                                                            {event.availableSeats - event.bookedSeats} / {event.availableSeats}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
            <BottomBar price={event?.price} eventId={event?._id} />
        </div>
    );
}