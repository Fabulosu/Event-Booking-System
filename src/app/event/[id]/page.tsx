"use client";
import BottomBar from "@/components/bottombar";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegClock, FaRegCalendar } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Event {
    title: string;
    location: string;
    date: string;
    price: number;
    description: string;
    organizer: {
        username: string;
    };
}

export default function EventPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchEvent = async () => {
                try {
                    const response = await fetch(`/api/events/${id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setEvent(data);
                    } else {
                        const errorData = await response.json();
                        setError(errorData.error);
                    }
                } catch (err) {
                    setError("Failed to fetch event data.");
                } finally {
                    setLoading(false);
                }
            };

            fetchEvent();
        }
    }, [id]);

    if (loading) return <p>Loading event details...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="relative w-full h-full">
            <Navbar className="relative" />
            {event ? (
                <div className="flex flex-col px-12">
                    <div className="relative w-full h-[500px]">
                        <Image src="/images/mock.png" fill={true} alt="Mock event image" className="object-fill" />
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="w-1/2 flex flex-col gap-10">
                            <div className="flex flex-col gap-2">
                                <h1 className="font-semibold text-4xl">{event.title}</h1>
                                <p className="text-wrap w-[800px]">{event.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col h-10 justify-between -space-y-2">
                                    <p className="text-gray-600 ">Organized by</p>
                                    <p className="font-semibold">{event.organizer.username}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="flex flex-row gap-1 items-center"><IoLocationOutline className="text-[#24AE7C]" />{event.location}</p>
                                <p className="flex flex-row gap-1 items-center">
                                    <FaRegCalendar className="text-[#24AE7C]" />
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>
                                <p className="flex flex-row gap-1 items-center">
                                    <FaRegClock className="text-[#24AE7C]" />
                                    {new Date(event.date).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-col items-end">
                            <iframe
                                width="400"
                                height="277"
                                loading="lazy"
                                allowFullScreen
                                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API}&q=Grand Hotel Bucharest,Romania`}
                                className="my-4 border-0"
                                style={{ border: 0 }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <p>No event found.</p>
            )}
            <BottomBar price={event?.price} />
        </div>
    );
}
