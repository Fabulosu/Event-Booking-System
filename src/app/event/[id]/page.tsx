"use client";
import BottomBar from "@/components/bottombar";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegClock, FaRegCalendar } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Event {
    _id: string;
    title: string;
    address: string;
    date: string;
    price: number;
    description: string;
    organizer: {
        username: string;
    };
    imageUrl: string;
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
                <div className="flex flex-col px-4 md:px-12">
                    <div className="relative w-full h-[300px] md:h-[500px]">
                        <Image src={event.imageUrl && `/uploads/` + event.imageUrl || "/images/mockhead.png"} fill={true} alt="Mock event image" className="object-cover" />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mt-6">
                        <div className="w-full lg:w-1/2 flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <h1 className="font-semibold text-2xl lg:text-4xl">{event.title}</h1>
                                <p className="w-full lg:w-full text-justify">{event.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="text-gray-600">Organized by</p>
                                    <p className="font-semibold">{event.organizer.username}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="flex flex-row gap-1 items-center">
                                    <IoLocationOutline className="text-[#24AE7C]" />
                                    {event.address}
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaRegCalendar className="text-[#24AE7C]" />
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaRegClock className="text-[#24AE7C]" />
                                    {new Date(event.date).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                            <iframe
                                width="100%"
                                height="300"
                                loading="lazy"
                                allowFullScreen
                                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API}&q=${event.address}`}
                                className="mt-4 mb-24 border-0"
                                style={{ border: 0 }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-96">
                    <p className="font-bold text-center">No event found.</p>
                </div>
            )}
            <BottomBar price={event?.price} eventId={event?._id} />
        </div>
    );
}
